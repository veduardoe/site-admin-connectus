import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { CategoriasService } from 'src/app/shared/services/categorias.service';
import { UtilsService } from 'src/app/shared/services/common/utils.service';
import { EventosService } from 'src/app/shared/services/eventos.service';
import { UsuariosService } from 'src/app/shared/services/usuarios.service';
import { ENV } from 'src/environments/environment';

@Component({
  selector: 'app-form-eventos',
  templateUrl: './form-eventos.component.html',
  styleUrls: ['./form-eventos.component.scss']
})
export class FormEventosComponent implements OnInit {

  estados = [{ id: 'ACTIVE', value: true }, { id: 'INACTIVE', value: false }];
  routeFichero = ENV.FICHEROS;
  fotoPerfil;
  nomUsuario;
  today = new Date();
  detalleHTML = "";
  hora = '09:00';
  categorias = [];
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: false,
    height: 'auto',
    minHeight: '200px',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'no',
    enableToolbar: false,
    showToolbar: true,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons:[ 
      ['fontName', 'outdent','indent', 'heading'],
      ['fontSize', 'textColor', 'backgroundColor', 'insertVideo',
      'customClasses','toggleEditorMode','removeFormat', 'insertImage']]
  };
  
  @Output() dialogEvent: EventEmitter<any> = new EventEmitter();

  mainForm = new FormGroup({
    _id: new FormControl(null),
    titulo: new FormControl(null, [Validators.required]),
    preDetalle: new FormControl(null, [Validators.required]),
    idCategoria: new FormControl(null, [Validators.required]),
    detalle: new FormControl(null),
    lugar: new FormControl(null, [Validators.required]),
    fecha: new FormControl(null, [Validators.required]),
    hora: new FormControl('09:00', [Validators.required]),
    resaltado: new FormControl(false, [Validators.required]),
    habilitado: new FormControl(true, [Validators.required]),
    idioma: new FormControl('ES'),
    foto: new FormControl(null)
  });


  constructor(
    @Inject(MAT_DIALOG_DATA) public input: { data: any },
    public utils: UtilsService,
    public usuariosService: UsuariosService,
    public eventosService: EventosService,
    public categoriasService: CategoriasService
  ) {
    if (this.input?.data) {
      let data = this.input.data[0];
      data.fecha = new Date(data.fechaHoraStr.split('T')[0] + 'T12:00:00');     // data.hora = 
      const hora = data.fechaHoraStr.split("T")[1].split(":");
      this.hora = `${hora[0]}:${hora[1]}`; 
      data.hora = this.hora;
      this.mainForm.patchValue(data);
    }

  }

  ngOnInit(): void {
    this.getCategorias();
  }

  getCategorias(){
    this.categoriasService.find({}).then( (res:any) => {
      this.categorias = res.data;
    });
  }

  setHora(e){
    this.hora = e;
    this.mainForm.patchValue({ hora: e });
  }
  save() {

    this.triggedValidation(true);

    if (!this.mainForm.valid) {
      return;
    }

    const data = this.mainForm.getRawValue();
    const fechaSh = data.fecha.toJSON().split("T")[0];
    data.fechaHora = `${fechaSh}T${data.hora}:00`;
    data.fechaHoraStr = data.fechaHora;

    if(!data.foto){
      this.utils.fnMainDialog('Error','Debe seleccionar una imagen para el evento', 'message');
      return;
    }

    this.utils.setLoading(true);

    const prom = (data._id) ? this.eventosService.put(data._id, data) : this.eventosService.post(data);

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

  get mf() {
    return this.mainForm.controls;
  }

  triggedValidation(touched) {
    const obj = this.mainForm.value;
    Object.keys(obj).forEach(key => {
      touched ? this.mainForm.get(key).markAsTouched() : this.mainForm.get(key).markAsUntouched()
    });
  }

  openInputFile(id) {
    document.getElementById("fotoevento").click();
  }

  fileChange(files: File[]) {

    Object.keys(files).forEach(a => {
      this.prepareFile(files[a]);
    });
    let val: any = document.getElementById("fotoevento");
    val.value = null;

  }

  prepareFile(file: any) {

    let reader = new FileReader();
    let size = Math.round((file['size'] / 1000) * 100) / 100;

    if (size < 1000) {

      reader.readAsDataURL(file);
      reader.onload = () => {

        let file64 = String(reader.result).split(";");
        let fichero = String(reader.result);
        let mimetype = file64[0].split(":")[1];
        const mimeTypeImagenes = mimetype == "image/jpg" || mimetype == "image/jpeg" || mimetype == "image/gif" || mimetype == "image/png";

        if (mimeTypeImagenes) {

          this.fotoPerfil = fichero;
          this.mainForm.patchValue({ foto: fichero });

        } else {

          this.utils.fnMessage("Tipo de archivo no permitido");

        }

      };
    } else {
      this.utils.fnMessage("La foto del evento no debe ser mayor a 1MB");
    }

  }

  removerImagen() {
    this.utils.fnMainDialog('Confirmación', '¿Está seguro de remover la imagen?', 'confirm').subscribe(res => {
      if (res) {
        this.mainForm.patchValue({ foto: null });
      }
    })
  }

}
