import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FormAcAgentesComponent } from 'src/app/shared/components/modals/form-ac-agentes/form-ac-agentes.component';
import { FormAcClientesComponent } from 'src/app/shared/components/modals/form-ac-clientes/form-ac-clientes.component';
import { FormAcPropiedadesComponent } from 'src/app/shared/components/modals/form-ac-propiedades/form-ac-propiedades.component';
import { AutenticacionService } from 'src/app/shared/services/autenticacion/autenticacion.service';
import { UtilsService } from 'src/app/shared/services/common/utils.service';
import { PropiedadesService } from 'src/app/shared/services/propiedades/propiedades.service';
import { SolicitudesService } from 'src/app/shared/services/solicitudes/solicitudes.servce';
import { ENV } from 'src/environments/environment';

@Component({
  selector: 'app-gestion-solicitud',
  templateUrl: './gestion-solicitud.component.html',
  styleUrls: ['./gestion-solicitud.component.scss']
})
export class GestionSolicitudComponent implements OnInit {

  tipoUsuario;
  solicitud: any;
  picRoutePropiedades = ENV.PROPIEDADES;
  routeFotoPerfil = ENV.FOTOS_PERFIL;
  agentesignadoEstado;
  tiposPropiedades = [];
  boxComentario;
  agendaCita = {
    lugar: null,
    fecha: null,
    hora: null,
    notificado: false,
    notificarCambio: false
  };
  horas = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00',
    '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00',
    '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
    '20:00', '20:30', '21:00', '21:30'];
  constructor(
    public utils: UtilsService,
    private solicitudesService: SolicitudesService,
    private aRouter: ActivatedRoute,
    private auth: AutenticacionService,
    private propiedadesService: PropiedadesService,
    private dialog: MatDialog,
    private router: Router
  ) {

    this.utils.fnBreadcrumbsState().setBreadcrumbsState({
      t: 'Gestión de Solicitudes',
      b: [{ n: 'Gestión de Solicitudes', r: '/detalle' }]
    });
    this.tipoUsuario = this.auth.getAuthInfo()['tipoUsuario'];

  }

  ngOnInit(): void {


    this.aRouter.params.subscribe(params => {
      if (params['id']) {
        this.getOne(params['id']);
      } else {
        this.solicitud = {
          fuente: 'DPA',
          asignaciones: [],
          visitas: [],
          comentarios: [],
          idPropiedad: null,
          idCliente: null,
          autoasignacion: true,
          estado: null,
          datosRecopilados: {
            tipoPropiedad: null
          }

        }
      }
    });

    this.getTiposPropiedades();
  }

  getOne(id) {
    this.utils.setLoading(true);
    this.solicitudesService.find({ _id: id }).then((res: any) => {
      this.solicitud = res.data[0];
      this.solicitud.visitas = this.solicitud.hasOwnProperty('visitas') ? this.solicitud.visitas : []
      this.utils.setLoading(false);
    }).catch(err => {
      this.utils.fnError();
      this.utils.setLoading(false);
    })
  }

  getTiposPropiedades() {
    this.propiedadesService.findTiposPropiedades().then((res: any) => {
      this.tiposPropiedades = res.data;
    });
  }

  addComentario() {

    if (!this.boxComentario) {
      this.utils.fnMessage("Agregue un comentario");
      return;
    }

    const item = JSON.parse(JSON.stringify({
      fecha: new Date(),
      detalle: this.boxComentario
    }))
    this.solicitud.comentarios.unshift(item);
    this.boxComentario = null;
    this.utils.fnMessage("Comentario agregado correctamente");
  }

  addVisita() {

    if (!this.agendaCita.fecha || !this.agendaCita.lugar) {
      this.utils.fnMessage("Debe indicar la Fecha y el Lugar");
      return;
    }

    const item = JSON.parse(JSON.stringify(this.agendaCita));

    this.solicitud.visitas.unshift(item);
    this.agendaCita.fecha = null;
    this.agendaCita.lugar = null;
    this.agendaCita.hora = null;

    this.utils.fnMessage("Comentario agregado correctamente");

  }

  removerVisita(index) {
    this.utils.fnMainDialog('Confirmación', '¿Está segura de remover la cita?', 'confirm').subscribe(res => {
      if (res) {
        const visita = this.solicitud.visitas[0];
        if (!visita.notificado) {
          this.solicitud.visitas.splice(index, 1);
        } else {
          visita.notificarCambio = true;
        }
        this.utils.fnMessage("Cita removida correctamente.");
      }
    })

  }

  get agenteAsignado() {
    const a = this.utils.getAgenteAsignado(this.solicitud.asignaciones);
    if (!this.agentesignadoEstado) {
      this.agentesignadoEstado = a.estado;
    }
    return a;
  }

  changeEstadoAgente(event) {
    const e = event.value;
    if (e === 'ASIGNADO') {
      this.solicitud.estado = 'ASIGNADO';
      this.solicitud.autoasignacion = false;
    } else {
      this.solicitud.estado = e;
    }
    const nAsignaciones = this.solicitud.asignaciones.length;
    this.solicitud.asignaciones[nAsignaciones - 1].estado = this.solicitud.estado;
  }

  openCliente() {

    const dForm = this.dialog.open(FormAcClientesComponent, {
      width: '90%',
      maxWidth: '540px',
      autoFocus: false,
      disableClose: true
    });

    dForm.componentInstance.dialogEvent.subscribe((data) => {
      this.solicitud.cliente = data;
      this.solicitud.idCliente = data._id
      this.dialog.closeAll();
    });

  }

  openAgente() {

    const dForm = this.dialog.open(FormAcAgentesComponent, {
      width: '90%',
      maxWidth: '540px',
      autoFocus: false,
      disableClose: true
    });

    dForm.componentInstance.dialogEvent.subscribe((data) => {
      const idxAgente = this.solicitud.asignaciones.findIndex(item => item.idAgente == data._id);
      if (idxAgente >= 0) {
        this.solicitud.asignaciones.splice(idxAgente, 1);
      }
      this.solicitud.asignaciones.push({
        idAgente: data._id,
        agente: data,
        fechaAsignacion: new Date(),
        estado: 'ESPERA_ACEPTACIÓN'
      });
      this.agentesignadoEstado = 'ESPERA_ACEPTACIÓN';
      this.solicitud.estado = 'ESPERA_ACEPTACIÓN';
      this.dialog.closeAll();
    });

  }

  openPropiedad() {

    const dForm = this.dialog.open(FormAcPropiedadesComponent, {
      width: '90%',
      maxWidth: '720px',
      autoFocus: false,
      disableClose: true
    });

    dForm.componentInstance.dialogEvent.subscribe((data) => {
      this.solicitud.propiedad = data;
      this.solicitud.idPropiedad = data._id;
      this.dialog.closeAll();
    });

  }


  guardar(reinicio = false) {
    
    const solicitud = JSON.parse(JSON.stringify(this.solicitud));
    delete solicitud.propiedad;
    delete solicitud.agenteAsignado;
    delete solicitud.cliente;

    if(reinicio){
      solicitud.asignaciones = [];
      solicitud.reinicioAutoasignacion = true;
    }

    solicitud.asignaciones.forEach((val, key) => {
      delete val.agente;
    });

    if (!solicitud._id) {
      if (!this.solicitud.datosRecopilados.tipoPropiedad) {
        this.utils.fnMainDialog('Error', 'Para generar la solicitud debe indicar el tipo de propiedad.', 'message');
        return;
      }
    }

    const txt = reinicio ? '¿Está seguro de reiniciar la autoasignación de agentes?' : '¿Está seguro de que desea guardar los cambios efectuados en la solicitud?';

    this.utils.fnMainDialog(
      'Confirmación', txt, 'confirm').subscribe(res => {
        if (res) {
          const req = solicitud._id ? this.solicitudesService.put(solicitud._id, solicitud) : this.solicitudesService.post(solicitud);
          req.then((res: any) => {
            if (res.response) {
              this.utils.fnSuccessSave();
              this.router.navigate(['/solicitudes']);
            } else {
              this.utils.fnErrorNoSave();
            }
          })
        }
      })
  }

  anularCompletar(estado) {

    const solicitud = JSON.parse(JSON.stringify(this.solicitud));

    const visitas = solicitud.visitas.map(item => {
      item.notificado = true;
      item.notificarCambio = false;
      return item;
    });
    const txx = estado === 'ANULADO' ? 'anular' : 'completar';
    this.utils.fnMainDialog('Confirmación', '¿Estás seguro de ' + txx + ' la solicitud? Esta acción no podrá revertirse', 'confirm').subscribe(r => {
      if (r) {
        const data = {
          estado: estado,
          visitas,
          autoasignacion: false
        }
        this.solicitudesService.put(this.solicitud._id, data).then((res: any) => {
          const tx = estado === 'ANULADO' ? 'anulada' : 'completada';
          if (res.response) {
            this.solicitud.estado = estado;
            this.solicitud.visitas = visitas;
            this.solicitud.autoasignacion = false;
            this.utils.fnMainDialog('Notificación', 'Solicitud ' + tx + ' correctame', 'message');
          } else {
            this.utils.fnMainDialog('Error', 'Solicitud no puede ser ' + tx + '. Intente más tarde.', 'message');
          }
        });
      }
    });
  }

  get canEdit() {
    return (this.solicitud.estado !== 'ANULADO' && this.solicitud.estado !== 'COMPLETADO' && this.tipoUsuario === 'ADMIN') || this.canEditAgente
  }

  get canEditAgente() {
    return (this.solicitud.estado !== 'ANULADO' && this.solicitud.estado !== 'COMPLETADO' && this.tipoUsuario === 'AGENTE' && this.solicitud.estado !== 'ESPERA_ACEPTACIÓN')
  }
  gestionarSolicitud(action) {

    const solicitud = JSON.parse(JSON.stringify(this.solicitud));
    const ac = action === 'ACEPTO' ? 'ACEPTAR' : 'RECHAZAR';
    this.utils.fnMainDialog('Confirmación', '¿Está seguro ' + ac + ' la solicitud? Esta acción no podrá ser revertida.', 'confirm').subscribe(res => {
      if (res) {
        let data = {};
        let estadoAsignacion = null;
        let estadoSolicitud = null;

        if (action === 'ACEPTO') {
          estadoAsignacion = 'ASIGNADO';
          estadoSolicitud = 'ASIGNADO';
        } else {
          estadoAsignacion = 'REASIGNADO';
          estadoSolicitud = 'REASIGNADO';
        }

        solicitud.asignaciones.forEach((val, key) => {
          delete val.agente;
        });

        solicitud.asignaciones[solicitud.asignaciones.length - 1].estado = estadoAsignacion;
        data = { 
            estado: estadoAsignacion, 
            asignaciones: solicitud.asignaciones, 
            datosRecopilados: { 
              ...solicitud.datosRecopilados, 
              tipoPropiedad: solicitud.datosRecopilados.tipoPropiedad 
              }, 
            referencia: solicitud.referencia };

        this.solicitudesService.put(this.solicitud._id, data).then((res: any) => {
          if (res.response) {
            this.utils.fnMainDialog('Notificación', 'Solicitud gestionada correctamente.', 'message');
            this.solicitud.estado = estadoSolicitud;
            if (action !== 'ACEPTO') {
              this.router.navigate(['/solicitudes']);
            }
          } else {
            this.utils.fnMainDialog('Error', 'Solicitud no puede ser APROBADA/RECHAZADA. Intente más tarde.', 'message');
          }
        });
      }
    });


  }
}
