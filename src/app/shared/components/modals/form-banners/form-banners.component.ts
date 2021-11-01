import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BannersService } from 'src/app/shared/services/banners.service';
import { UtilsService } from 'src/app/shared/services/common/utils.service';
import { UsuariosService } from 'src/app/shared/services/usuarios.service';
import { ENV } from 'src/environments/environment';

@Component({
  selector: 'app-form-banners',
  templateUrl: './form-banners.component.html',
  styleUrls: ['./form-banners.component.scss']
})
export class FormBannersComponent implements OnInit {

  estados = [{ id: 'ACTIVE', value: true}, { id: 'INACTIVE', value: false}];
  idiomas = [{ id: 'SPANISH', value: 'ES'}, { id: 'ENGLISH', value: 'EN'}];
  tiposBanners = ['UPPER_BANNER', 'SIDE_BANNER', 'TEXTUAL_BANNER'];
  routeImagen = ENV.FICHEROS;
  fotoPerfil;
  nomUsuario;

  @Output() dialogEvent: EventEmitter<any> = new EventEmitter();

  mainForm = new FormGroup({
    _id: new FormControl(null),
    tipo: new FormControl(null, [Validators.required]),
    titulo: new FormControl(null, [Validators.required]),
    tituloResaltado: new FormControl(null, [Validators.required]),
    url: new FormControl(null),
    habilitado: new FormControl(null, [Validators.required]),
    idioma: new FormControl(null, [Validators.required]),
    imagen: new FormControl(null),
    posicion: new FormControl(1,  [Validators.required]),
  });


  constructor(
    @Inject(MAT_DIALOG_DATA) public input: { data: any },
    public utils: UtilsService,
    public bannerService: BannersService
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
    if (!this.mainForm.valid) {
      return;
    }

    
    this.utils.setLoading(true);

    const prom = (data._id) ? this.bannerService.put(data._id, data) : this.bannerService.post(data);
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
    document.getElementById("fotoperfil").click();
  }

  fileChange(files: File[]) {

    Object.keys(files).forEach(a => {
      this.prepareFile(files[a]);
    });
    let val: any = document.getElementById("fotoperfil");
    val.value = null;

  }

  prepareFile(file: any) {

    let reader = new FileReader();
    let size = Math.round((file['size'] / 1000) * 100) / 100;

    if (size < 10000) {

      reader.readAsDataURL(file);
      reader.onload = () => {

        let file64 = String(reader.result).split(";");
        let fichero = String(reader.result);
        let mimetype = file64[0].split(":")[1];
        const mimeTypeImagenes = mimetype == "image/jpg" || mimetype == "image/jpeg" || mimetype == "image/gif" || mimetype == "image/png";

        if (mimeTypeImagenes) {
          this.fotoPerfil = fichero;
          this.mainForm.patchValue({ imagen: fichero });
        } else {

          this.utils.fnMessage("File type not allowed");

        }

      };
    } else {
      this.utils.fnMessage("Max filesize 10MB.");
    }

  }

  removerImagen() {
    this.utils.fnMainDialog('Confirm', 'are you sure to remove this picture?', 'confirm').subscribe(res => {
      if (res) {
        this.mainForm.patchValue({ imagen: null });
      }
    })
  }
}
