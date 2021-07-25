import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AutenticacionService } from 'src/app/shared/services/autenticacion/autenticacion.service';
import { UtilsService } from 'src/app/shared/services/common/utils.service';
import { HistoricoPagosService } from 'src/app/shared/services/historico-pagos/historico-pagos.service';
import { PlanesAgentesService } from 'src/app/shared/services/planes-agentes/planes-agentes.service';
import { PropiedadesService } from 'src/app/shared/services/propiedades/propiedades.service';
import { UsuariosService } from 'src/app/shared/services/usuarios/usuarios.service';
import { CONFIG } from 'src/environments/configurations';
import { ENV } from 'src/environments/environment';

@Component({
  selector: 'app-form-pagos',
  templateUrl: './form-pagos.component.html',
  styleUrls: ['./form-pagos.component.scss']
})
export class FormPagosComponent implements OnInit {

  estados = ['PAGADO', 'ANULADO', 'PAGO_PENDIENTE'];
  planesAgentes = [];
  tipoUsuario;
  numberConfig = CONFIG.NUMBER_DIRECTIVE;

  @Output() dialogEvent: EventEmitter<any> = new EventEmitter();

  mainForm = new FormGroup({
    _id: new FormControl(null),
    idAgente: new FormControl(null, [Validators.required]),
    fechaDesde: new FormControl(null, [Validators.required]),
    fechaHasta: new FormControl(null, [Validators.required]),
    fechaPago: new FormControl(null),
    idPlan: new FormControl(null, [Validators.required]),
    monto: new FormControl(null),
    comentarios: new FormControl(null),
    estado: new FormControl('PAGO_PENDIENTE', [Validators.required]),
  });


  constructor(
    @Inject(MAT_DIALOG_DATA) public input: { data: any, idAgente: string },
    public utils: UtilsService,
    public usuariosService: UsuariosService,
    public historicoPagosService: HistoricoPagosService,
    public planesAgentesService: PlanesAgentesService,
    public auth: AutenticacionService
  ) {

    this.tipoUsuario = this.auth.getAuthInfo()['tipoUsuario'];

    if(this.tipoUsuario !== 'ADMIN'){
      this.mainForm.disable();
    }
    if (this.input.idAgente) {
      this.mainForm.patchValue({ idAgente: this.input.idAgente });
    }

    if (this.input.data) {
      this.mainForm.patchValue(this.input.data);
    }

    this.getPlanes();
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

    const prom = (data._id) ? this.historicoPagosService.put(data._id, data) : this.historicoPagosService.post(data);
    prom.then(res => {
      if (res['response']) {
        this.dialogEvent.emit(true);
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

  get mf() {
    return this.mainForm.controls;
  }

  getPlanes() {
    this.planesAgentesService.find(null).then((res: any) => {
      if (res.response) {
        this.planesAgentes = res.data;
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
