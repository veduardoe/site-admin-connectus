import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AutenticacionService } from 'src/app/shared/services/autenticacion/autenticacion.service';
import { UtilsService } from 'src/app/shared/services/common/utils.service';
import { GananciasService } from 'src/app/shared/services/ganancias/ganancias.service';
import { HistoricoPagosService } from 'src/app/shared/services/historico-pagos/historico-pagos.service';
import { PlanesAgentesService } from 'src/app/shared/services/planes-agentes/planes-agentes.service';
import { SolicitudesService } from 'src/app/shared/services/solicitudes/solicitudes.servce';
import { UsuariosService } from 'src/app/shared/services/usuarios/usuarios.service';
import { CONFIG } from 'src/environments/configurations';

@Component({
  selector: 'app-form-ganancias',
  templateUrl: './form-ganancias.component.html',
  styleUrls: ['./form-ganancias.component.scss']
})
export class FormGananciasComponent implements OnInit {

  estados = ['VIGENTE', 'PAGADO', 'NO_VIGENTE', 'PENDIENTE_PAGO', 'EVALUACIÓN'];
  monedas = ['UF', 'USD', 'CLP'];
  planesAgentes = [];
  historicoPagos = [];
  solicitudesCompletadas = [];
  tipoUsuario;
  numberConfig = CONFIG.NUMBER_DIRECTIVE;

  @Output() dialogEvent: EventEmitter<any> = new EventEmitter();

  mainForm = new FormGroup({
    _id: new FormControl(null),
    idSolicitud: new FormControl(null, [Validators.required]),
    idAgente: new FormControl(null, [Validators.required]),
    moneda: new FormControl('UF', [Validators.required]),
    precioPropiedad: new FormControl(0, [Validators.required]),
    montoComision: new FormControl(0, [Validators.required]),
    montoGanancia: new FormControl(0, [Validators.required]),
    idPlanAgente: new FormControl(null, [Validators.required]),
    estado: new FormControl('VIGENTE', [Validators.required]),
    comentarios: new FormControl(null),
  });


  constructor(
    @Inject(MAT_DIALOG_DATA) public input: { data: any, ganancias: any, idAgente: string },
    public utils: UtilsService,
    public usuariosService: UsuariosService,
    public historicoPagosService: HistoricoPagosService,
    public planesAgentesService: PlanesAgentesService,
    public solicitudesService: SolicitudesService,
    public gananciasService: GananciasService,
    public auth: AutenticacionService
  ) {

    this.tipoUsuario = this.auth.getAuthInfo()['tipoUsuario'];
    this.mainForm.controls.montoGanancia.disable();
    this.mainForm.controls.montoComision.disable();

    if (this.tipoUsuario !== 'ADMIN') {
      this.mainForm.disable();
    }
    if (this.input.idAgente) {
      this.mainForm.patchValue({ idAgente: this.input.idAgente });
    }

    if (this.input.data) {
      this.mainForm.controls.idSolicitud.disable();
      this.mainForm.patchValue(this.input.data);
    }

    this.getPlanes();
    this.getHistorico();
    this.getSolicitudesCompletadas();
  }

  ngOnInit(): void {

  }

  save() {

    const data = this.mainForm.getRawValue();
    this.triggedValidation(true);

    if (!this.mainForm.valid) {
      return;
    }

    this.utils.setLoading(true);

    const prom = (data._id) ? this.gananciasService.put(data._id, data) : this.gananciasService.post(data);
    prom.then(res => {
      if (res['response']) {
        this.dialogEvent.emit(true)
      } else {
        this.utils.fnError();
      }
      this.utils.setLoading(false);

    }).catch(err => {

      if (err['error']['message']) {
        this.utils.fnMainDialog("Error", err['error']['message'], "message");
      } else {
        this.utils.fnError();
      }
      this.utils.setLoading(false);
    });

  }

  changePlan(event) {

    const idPlan = event.value;
    const plan  = this.planesAgentes.find( item => {
      return idPlan === item._id
    })
    this.mainForm.patchValue({ montoComision: plan.comision });
    this.calcular();

  }

  changeSolicitud(event){

    const idSolicitud = event.value;
    const solicitud  = this.solicitudesCompletadas.find( item => {
      return idSolicitud === item._id
    });
    this.mainForm.patchValue({ precioPropiedad: solicitud.propiedad ? solicitud.propiedad.precio : 0 });
    this.calcular();

  }

  get mf() {
    return this.mainForm.controls;
  }

  calcular(){
    const datos = this.mainForm.getRawValue();
    const precioInmueble = datos.precioPropiedad;
    const comision = datos.montoComision / 100;
    this.mainForm.patchValue({ montoGanancia : precioInmueble *  comision });
  }

  getPlanes() {
    this.planesAgentesService.find(null).then((res: any) => {
      if (res.response) {
        this.planesAgentes = res.data;
      }
    })
  }

  getSolicitudesCompletadas() {
    this.solicitudesService.findCompletados({ idAgente: this.input.idAgente }).then((res: any) => {
      if (res.response) {
        if(!this.input.data){
          const data = res.data.filter( item => {
            const match = this.input.ganancias.find( gan => gan.idSolicitud === item._id);
            if(!match){
              return item;
            }
          });
          this.solicitudesCompletadas = data;
        }else{
          this.solicitudesCompletadas = res.data;
        }
      }
      if(this.solicitudesCompletadas.length === 0){
        this.mainForm.controls.idSolicitud.disable();
      }

    })
  }

  getHistorico() {
    this.historicoPagosService.find({ idAgente: this.input.idAgente }).then((res: any) => {
      if (res.response) {
        this.historicoPagos = res.data;
      }
    })
  }

  triggedValidation(touched) {
    const obj = this.mainForm.value;
    Object.keys(obj).forEach(key => {
      touched ? this.mainForm.get(key).markAsTouched() : this.mainForm.get(key).markAsUntouched()
    });
  }

}
