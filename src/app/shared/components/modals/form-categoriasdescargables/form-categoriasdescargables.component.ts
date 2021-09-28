import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UtilsService } from 'src/app/shared/services/common/utils.service';
import { ContenidosDescargablesService } from 'src/app/shared/services/descargables.service';
import { ENV } from 'src/environments/environment';

@Component({
  selector: 'app-form-categoriasdescargables',
  templateUrl: './form-categoriasdescargables.component.html',
  styleUrls: ['./form-categoriasdescargables.component.scss']
})
export class FormCategoriasDescargablesComponent implements OnInit {

  estados = [{ id: 'ACTIVE', value: true }, { id: 'INACTIVE', value: false }];
  idiomas = [{ id: 'ESPAÑOL', value: 'ES' }, { id: 'ENGLISH', value: 'EN' }];
  routeStorage = ENV.STORAGE;
  pathFicheros = '/contenidosdescargables%2F'

  @Output() dialogEvent: EventEmitter<any> = new EventEmitter();

  mainForm = new FormGroup({
    _id: new FormControl(null),
    titulo: new FormControl(null, [Validators.required]),
    descripcion: new FormControl(null, [Validators.required]),
    fotoPresentacion: new FormControl(null, [Validators.required]),
    fotoPortada: new FormControl(null, [Validators.required]),
    habilitar: new FormControl(null, [Validators.required]),
    idioma: new FormControl(null, [Validators.required]),
    posicion: new FormControl(1, [Validators.required]),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public input: { data: any },
    public utils: UtilsService,
    public conDesService: ContenidosDescargablesService
  ) {

    if (this.input.data) {
      let data = this.input.data;
      this.mainForm.patchValue(data);
    }

  }

  ngOnInit(): void {
  }

  save() {

    const data = this.mainForm.getRawValue();

    this.triggedValidation(true);

    if(!data.fotoPortada || !data.fotoPresentacion){
      this.utils.fnMainDialog("Error", "You must select all the pictures.", "message");
    }

    if (!this.mainForm.valid) {
      return;
    }

    this.utils.setLoading(true);

    const prom = (data._id) ? this.conDesService.putCategory(data._id, data) : this.conDesService.postCategory(data);
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
      touched ? this.mainForm.get(key).markAsTouched() : this.mainForm.get(key).markAsUntouched();
    });
  }

  openInputFile(id) {
    document.getElementById(id).click();
  }

  fileChange(files: File[], id) {

    Object.keys(files).forEach(a => {
      this.prepareFile(files[a], id);
    });
    let val: any = document.getElementById(id);
    val.value = null;

  }

  prepareFile(file: any, id) {

    let reader = new FileReader();
    let size = Math.round((file['size'] / 1000) * 100) / 100;

    if (size < 15000) {

      reader.readAsDataURL(file);
      reader.onload = () => {

        let file64 = String(reader.result).split(";");
        let fichero = String(reader.result);
        let mimetype = file64[0].split(":")[1];
        const mimeTypeImagenes = mimetype == "image/jpg" || mimetype == "image/jpeg" || mimetype == "image/gif" || mimetype == "image/png";

        if (mimeTypeImagenes) {

          if (id === 'fotoPresentacion') {
            this.mainForm.patchValue({ fotoPresentacion: fichero });
          }
  
          if (id === 'fotoPortada') {
            this.mainForm.patchValue({ fotoPortada: fichero });
          }

        } else {

          this.utils.fnMessage("File type not allowed");

        }

      };

    } else {
      this.utils.fnMessage("Max filesize 10MB.");
    }

  }

  removerImagen(id) {
    this.utils.fnMainDialog('Confirm', 'are you sure to remove this picture?', 'confirm').subscribe(res => {
      if (res) {
        if (id === 'fotoPresentacion') {
          this.mainForm.patchValue({ fotoPresentacion: null });
        }

        if (id === 'fotoPortada') {
          this.mainForm.patchValue({ fotoPortada: null });
        }
      }
    })
  }
}
