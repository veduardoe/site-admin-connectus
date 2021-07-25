import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from 'src/app/shared/services/common/utils.service';
import { PropiedadesService } from 'src/app/shared/services/propiedades/propiedades.service';
import { CONFIG } from 'src/environments/configurations';
import { ENV } from 'src/environments/environment';
import { REGIONES_COMUNAS } from 'src/environments/regiones_comunas';
import { CdkDragDrop, CdkDragEnter, moveItemInArray } from '@angular/cdk/drag-drop';
import { AutenticacionService } from 'src/app/shared/services/autenticacion/autenticacion.service';
import { MatDialog } from '@angular/material/dialog';
import { FormEnviarDocumentoComponent } from 'src/app/shared/components/modals/form-enviar-documento/form-enviar-documento.component';

@Component({
  selector: 'app-form-propiedades',
  templateUrl: './form-propiedades.component.html',
  styleUrls: ['./form-propiedades.component.scss']
})
export class FormPropiedadesComponent implements OnInit {

  idPropiedad;
  tipoUsuario;
  listadoImagenes: any = [];
  imagenes: any = [];
  listadoFicheros: any = [];
  ficheros: any = [];
  numberConfig = CONFIG.NUMBER_DIRECTIVE;
  regionesComunas: any = REGIONES_COMUNAS;
  picRoutePropiedades = ENV.PROPIEDADES;
  docRoutePropiedades = ENV.DOCUMENTOS_PROPIEDADES;
  tiposPropiedades: any = [];
  amenidades: any = [];
  seleccionTodo = false;
  arrExtras = [];
  indicadores;
  listadoLocalidades = {
    provincias: [],
    comunas: []
  }

  formExtra = {
    nombre : null,
    detalle: null,
    unidad: null
  }

  mainForm = new FormGroup({
    id: new FormControl(null),
    titulo: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', Validators.required),
    metraje: new FormControl(null, Validators.required),
    tipoOperacion: new FormControl(null, Validators.required),
    idTipoPropiedad: new FormControl(null, Validators.required),
    anioConstruccion: new FormControl(null, Validators.required),
    region: new FormControl(null, Validators.required),
    provincia: new FormControl(null, Validators.required),
    direccion: new FormControl(null, Validators.required),
    comuna: new FormControl(null, Validators.required),
    moneda: new FormControl('UF', Validators.required),
    precio: new FormControl(null, Validators.required),
    habitaciones: new FormControl(null, Validators.required),
    banos: new FormControl(null, Validators.required),
    destacado: new FormControl(false),
    estacionamiento: new FormControl(null, Validators.required),
    amenidades: new FormControl([]),
    fotos: new FormControl([]),
    videoUrl: new FormControl(null),
    ficheros: new FormControl([]),
    extras:  new FormControl([]),
    estado: new FormControl('ACTIVO', Validators.required),
    editable: new FormControl(true)
  });

  constructor(
    public utils: UtilsService,
    public propiedadesService: PropiedadesService,
    private aRouter: ActivatedRoute,
    private router: Router,
    private autenticacionService: AutenticacionService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {

    this.aRouter.params.subscribe(params => {
      if (params['id']) {
        this.getOne(params['id']);
      }
    });


    this.utils.fnBreadcrumbsState().setBreadcrumbsState({
      t: 'Detalle de la Propiedad',
      b: [
        { n: 'Propiedades', r: '/propiedades' },
        { n: 'Detalle', r: '/propiedades/detalle/aaa' }
      ]
    });

    this.getTiposPropiedades();
    this.getAmenidades();
    const userData = this.autenticacionService.getAuthInfo();
    this.tipoUsuario = userData.tipoUsuario;
    this.indicadores = JSON.parse(localStorage.getItem('indicadores'));

  }

  get mf() {
    return this.mainForm.controls;
  }

  changeVideoUrl(event){
    this.mainForm.patchValue({ videoUrl : event.target.value });
  }

  seleccionLocalidad(event, localidad) {

    if (localidad === 'REGION') {
      const regionSelected = event.value;
      const matchRegion = this.regionesComunas.find(item => item.region.toUpperCase() === regionSelected.toUpperCase());
      this.listadoLocalidades.provincias = matchRegion.provincias;
      this.mainForm.patchValue({ provincia: null, comuna: null });
    }

    if (localidad === 'PROVINCIA') {
      const provinciaSelected = event.value;
      const matchComuna = this.listadoLocalidades.provincias.find(item => item.name.toUpperCase() === provinciaSelected.toUpperCase());
      this.listadoLocalidades.comunas = matchComuna.comunas;
      this.mainForm.patchValue({ comuna: null });
    }

  }

  getOne(id) {
    this.idPropiedad = id;
    this.utils.setLoading(true);
    this.propiedadesService.findOne(id).then(async (res: any) => {
      if (res && res.response) {
        this.seleccionLocalidad({ value: res.data.region }, 'REGION');
        this.seleccionLocalidad({ value: res.data.provincia }, 'PROVINCIA');
        this.mainForm.patchValue(res.data);
        this.listadoImagenes = [];
        this.imagenes = !res.data.fotos ? [] : res.data.fotos;
        this.listadoFicheros = [];
        this.ficheros = !res.data.ficheros ? [] : res.data.ficheros;
        await this.getAmenidades();
        this.setAmenidadesSelected();
      } else {
        this.router.navigate(['/propiedades']);
        this.utils.fnMessage("La propiedad solicitada no existe.");
      }
      this.utils.setLoading(false);
    }).catch(err => {
      this.router.navigate(['/propiedades']);
      this.utils.fnMessage("La propiedad solicitada no existe.");
      this.utils.setLoading(false);
    });
  }

  destacar(current) {
    this.mainForm.patchValue({ destacado: !current });
  }

  getTiposPropiedades() {
    this.propiedadesService.findTiposPropiedades().then((res: any) => {
      this.tiposPropiedades = res.data;
    });
  }

  getAmenidades() {
    return new Promise((resolve, reject) => {
      this.propiedadesService.findAmenidades().then((res: any) => {
        this.amenidades = res.data.map( item => {
          item.selected = false;
          return item;
        });
        resolve(true);
      }).catch( err => {
        resolve(true);
      });
    });

  }

  setAmenidadesSelected(){
    const reqAmenidades = this.mainForm.value.amenidades;
    reqAmenidades.forEach((val, idx) => {
      this.amenidades.forEach((valA, keyA) => {
        if(val._id === valA._id){
          valA.selected = true;
        }
      });
    });
  }

  save() {
    this.triggedValidation(true);
    if (this.mainForm.valid) {
      const data = this.mainForm.getRawValue();
      data.amenidades = this.amenidades.filter( item => item.selected);
      const method = this.idPropiedad ? this.propiedadesService.put(this.idPropiedad, data) : this.propiedadesService.post(data);
      this.utils.setLoading(true);
      method.then((res: any) => {
        if (res.response) {
          this.idPropiedad = res.id;
          this.utils.fnMessage("Datos guardados correctamente");
        } else {
          this.utils.fnErrorNoSave();
        }
        this.utils.setLoading(false);
      }).catch(err => {
        this.utils.fnErrorNoSave();
        this.utils.setLoading(false);
      });
    }
  }

  triggedValidation(touched) {
    const obj = this.mainForm.value;
    Object.keys(obj).forEach(key => {
      touched ? this.mainForm.get(key).markAsTouched() : this.mainForm.get(key).markAsUntouched()
    });
  }

  openInputFile(id) {
    document.getElementById(id).click();
  }

  fileChange(files: File[], id) {

    const validateImagenes = (this.listadoImagenes.length + this.imagenes.length + files.length) > 12;
    const validateFicheros = (this.listadoFicheros.length + this.ficheros.length + files.length) > 12;

    if ((id === 'ficheros' && validateFicheros) || (id === 'imagenes' && validateImagenes)) {
      this.utils.fnMainDialog("Error", "No se pueden cargar más de 12 " + id + " por propiedad.", "message");
    } else {
      Object.keys(files).forEach(a => {
        this.prepareFile(files[a], id);
      });
      let val: any = document.getElementById(id);
      val.value = null;
    }
  }

  prepareFile(file: any, id) {

    let reader = new FileReader();
    let size = Math.round((file['size'] / 1000) * 100) / 100;
    const idtxt = id === 'imagenes' ? 'imágenes' : 'ficheros';

    if (size < 1000) {

      reader.readAsDataURL(file);
      reader.onload = () => {

        let file64 = String(reader.result).split(";");
        let idpropiedad = this.idPropiedad;
        let fichero = String(reader.result);
        let mimetype = file64[0].split(":")[1];
        const mimeTypeImagenes = mimetype == "image/jpg" || mimetype == "image/jpeg" || mimetype == "image/gif" || mimetype == "image/png";
        const mimeTypeDocumentos = mimetype == "application/pdf" || mimetype == "application/msword" || mimetype == "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          || mimetype == "application/vnd.ms-excel" || mimetype == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

        if ((mimeTypeImagenes && id === 'imagenes') || (mimeTypeDocumentos && id === 'ficheros')) {

          if (id === 'imagenes') {
            this.listadoImagenes.push({
              idpropiedad: idpropiedad,
              fichero: fichero,
              nombre: file.name
            });
          }

          if (id === 'ficheros') {
            this.listadoFicheros.push({
              idpropiedad: idpropiedad,
              fichero: fichero,
              nombre: file.name
            });
          }
        } else {
          this.utils.fnMessage("Algunas " + idtxt + " no se cargaron por tipo no permitido");
        }
      };
    } else {
      this.utils.fnMessage("Algunas " + idtxt + " no se cargaron por ser mayor a 1MB");
    }

  }

  subirFicheros(tipoFichero = 'FOTOS') {
    const obidx = tipoFichero === 'FOTOS' ? 'listadoImagenes' : 'listadoFicheros';
    let promises: any = this[obidx].map(item => {
      return this.propiedadesService.putFichero(this.idPropiedad, { tipo: tipoFichero, fichero: item.fichero, nombre: item.nombre });
    });
    this.utils.setLoading(true);
    Promise.all(promises).then(() => {
      this.getOne(this.idPropiedad);
      this.utils.fnMessage("Imagenes cargadas correctamente");
    }).catch(() => {
      this.getOne(this.idPropiedad);
      this.utils.fnMainDialog("Error", "Algunos ficheros no se pudieron cargar. Verifique e intente de nuevo", "message");
    });

  }

  borrarFichero(data: any, tipo: any, tipoFichero = 'FOTOS') {

    const idtxt = tipoFichero === 'FOTOS' ? 'imagen' : 'fichero';
    this.utils.fnMainDialog("Confirmación", "¿Está seguro de eliminar el(la) " + idtxt + ". La acción no podrá ser revertida", "confirm").subscribe(r => {
      if (r) {
        if (tipo == 'imagenes' || tipo == 'ficheros') {
          this.utils.setLoading(true);
          this.propiedadesService.putBorroFichero(this.idPropiedad, { fichero: data.fichero, tipo: tipoFichero }).then((res: any) => {
            if (res.response) {
              this.utils.fnMessage("" + idtxt + " borrada correctamente");
              this.getOne(this.idPropiedad);
            } else {
              this.utils.fnMessage("La " + idtxt + " no se pudo eliminar. Intente más tarde.");
              this.utils.setLoading(false);
            }

          }).catch(err => {
            this.utils.fnMessage("La " + idtxt + " no se pudo eliminar. Intente más tarde.");
            this.utils.setLoading(false);
          });
        } else {
          this[tipo].splice(data, 1);
          this.utils.fnMessage("" + idtxt + " eliminado(a) correctamente");
        }
      }
    });

  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.imagenes, event.previousIndex, event.currentIndex);
  }

  entered(event: CdkDragEnter) {
    moveItemInArray(this.imagenes, event.item.data, event.container.data);
  }

  seleccionatTodo(event){
    const checked = event.checked;
    this.amenidades = this.amenidades.map( item => {
      item.selected = checked;
      return item;
    });
  }

  addExtra(){
    
    if(!this.formExtra.nombre || !this.formExtra.detalle || !this.formExtra.unidad){
      this.utils.fnMainDialog('Error', 'Debe completar todos los datos solicitados', 'message');
      return;
    }

    const extras = this.mainForm.value.extras;
    extras.push(JSON.parse(JSON.stringify(this.formExtra)));
    this.mainForm.patchValue({ extras });
    this.utils.fnMessage('Característica agregada correctamente.');
    this.formExtra = { nombre: null, detalle: null, unidad: null};
  }

  eliminarExtra(i){
    this.utils.fnMainDialog('Confirmación', '¿Está seguro de eliminar la característica?', 'confirm').subscribe( res => {
      if(res){
        const extras = this.mainForm.value.extras;
        extras.splice(i, 1);
        this.mainForm.patchValue({ extras });
        this.utils.fnMessage('Característica eliminada correctamente.');
      }
    });
  }

  openEnviarDocumento(documento){

  
      const dForm = this.dialog.open(FormEnviarDocumentoComponent, {
        width: '90%',
        maxWidth: '720px',
        data: { documento },
        autoFocus: false,
        disableClose: true
      });
  
      dForm.componentInstance.dialogEvent.subscribe((result) => {
        this.dialog.closeAll();
        if(result){
          this.utils.fnMainDialog("Enviado", "DOCUMENTO ENVIADO", 'message');
        }
      });
  
  }
}
