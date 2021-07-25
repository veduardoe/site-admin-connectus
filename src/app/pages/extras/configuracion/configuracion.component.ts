import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/shared/services/common/utils.service';
import { CONFIG } from 'src/environments/configurations';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ConfigAppsService } from 'src/app/shared/services/config-apps/config-apps.service';
import { UsuariosService } from 'src/app/shared/services/usuarios/usuarios.service';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.scss']
})
export class ConfiguracionComponent implements OnInit {

  idOrdenAsignacion;
  tiempoCiclo = { _id: null, referencia: null, data: { tiempo: null } };
  habilitarAsignacion = { _id: null, referencia: null, data: { activar: null } };
  agentes;
  dirAgentes = {};

  numberConfig = CONFIG.NUMBER_DIRECTIVE;
  agentesSeleccionados = [];

  agentesDisponibles = [];

  constructor(
    private utils: UtilsService,
    private configAppService: ConfigAppsService,
    private usuariosService: UsuariosService
  ) { }

  ngOnInit(): void {

    this.utils.fnBreadcrumbsState().setBreadcrumbsState({
      t: 'Configuracion de Asignación de Solicitudes',
      b: [{ n: 'Configuracion de Asignación de Solicitudes', r: '/extras/configuracion' }]
    });
    this.getConfigs();
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  getConfigs() {
    this.utils.setLoading(true);
    this.configAppService.find({}).then(async (res: any) => {
      if (res.response) {
        this.tiempoCiclo = res.data.find(item => item.referencia === "TIEMPO_CICLO");
        this.habilitarAsignacion = res.data.find(item => item.referencia === "HABILITAR_AUTOASIGNACION");
        const ordenAsignacion = res.data.find(item => item.referencia === "ORDEN_ASIGNACION");
        this.idOrdenAsignacion = ordenAsignacion._id;
        this.agentesSeleccionados = ordenAsignacion.data.agentes;
        await this.getAgentes();
        const agentesDisponibles = this.agentesDisponibles.filter(itemDis  => {
          const findId = this.agentesSeleccionados.find(itemSel => itemSel === itemDis);
          if(!findId){
            return itemDis;
          }
        });
        this.agentesDisponibles = agentesDisponibles;
      }
      this.utils.setLoading(false);
    });
  }

  getAgentes() {
    return new Promise((resolve, reject) => {
      this.usuariosService.find({ tipoUsuario: 'AGENTE' }).then((res: any) => {
        res.data.forEach((val, key) => {
          this.dirAgentes[val._id] = val;
          this.agentesDisponibles.push(val._id);
          resolve(true);
        });
      });
    });

  }

  actualizarTiempo() {
    this.utils.setLoading(true);
    this.configAppService.put(this.tiempoCiclo._id, { data: { tiempo: this.tiempoCiclo.data.tiempo } }).then(res => {
      this.utils.setLoading(false);
      this.utils.fnMessage("Datos guardadas correctamente");
    }).catch(err => {
      this.utils.setLoading(false);
      this.utils.fnErrorNoSave();
    });
  }

  actualizarEstado() {
    this.utils.setLoading(true);
    this.configAppService.put(this.habilitarAsignacion._id, { data: { activar: this.habilitarAsignacion.data.activar } }).then(res => {
      this.utils.setLoading(false);
      this.utils.fnMessage("Datos guardadas correctamente");
    }).catch(err => {
      this.utils.setLoading(false);
      this.utils.fnErrorNoSave();
    });
  }

  actualizarOrden() {
    this.utils.setLoading(true);
    this.configAppService.put(this.idOrdenAsignacion, { data: { agentes: this.agentesSeleccionados } }).then(res => {
      this.utils.setLoading(false);
      this.utils.fnMessage("Datos guardadas correctamente");
    }).catch(err => {
      this.utils.setLoading(false);
      this.utils.fnErrorNoSave();
    });
  }
}
