import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UtilsService } from 'src/app/shared/services/common/utils.service';
import { UsuariosService } from 'src/app/shared/services/usuarios.service';
import { ENV } from 'src/environments/environment';

@Component({
  selector: 'app-form-administradores',
  templateUrl: './form-administradores.component.html',
  styleUrls: ['./form-administradores.component.scss']
})
export class FormAdministradoresComponent implements OnInit {

  estados = ['ACTIVO', 'INACTIVO', 'BLOQUEO_TEMPORAL', 'ESPERA_INGRESO'];
  modulos = [];
  routeFotoPerfil = ENV.FOTOS_PERFIL;
  fotoPerfil;
  nomUsuario;

  @Output() dialogEvent: EventEmitter<any> = new EventEmitter();

  mainForm = new FormGroup({
    _id: new FormControl(null),
    nombres: new FormControl(null, [Validators.required]),
    apellido_paterno: new FormControl(null, [Validators.required]),
    apellido_materno: new FormControl(null),
    email: new FormControl(null, [Validators.required]),
    telefono: new FormControl(null, [Validators.required]),
    tipoUsuario: new FormControl('ADMIN', [Validators.required]),
    estado: new FormControl('ESPERA_INGRESO', [Validators.required]),
    modulos: new FormControl([], [Validators.required]),
    a2FA:new FormControl(null),
    foto: new FormControl(null),
    clave: new FormControl(null),
    confirmarClave: new FormControl(null)

  });


  constructor(
    @Inject(MAT_DIALOG_DATA) public input: { data: any },
    public utils: UtilsService,
    public usuariosService: UsuariosService
  ) {
    this.modulos = this.utils.getModulos();
    if (this.input.data) {
      let data = this.input.data;
      this.nomUsuario = data.usuario;
      this.mainForm.patchValue(data);
      this.mainForm.controls.estado.enable();
    } else {
      this.mainForm.controls.estado.disable();
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

    if (!this.utils.validateEmail(data.email)) {
      this.utils.fnMainDialog('Error', 'El correo ingresado es incorrecto. Revíselo e intente nuevamente', 'message');
      return;
    }

    if(data.clave ){
      if(data.clave !== data.confirmarClave){
        this.utils.fnMainDialog('Error', 'Las contraseñas no coinciden. Verifique e intente nuevamente.', 'message');
        return;
      }

      if(data.clave.length < 8 || data.clave.length > 15){
        this.utils.fnMainDialog('Error', 'La contraseña debe tener entre 8 y 15. Verifique e intente nuevamente.', 'message');
        return;
      }
    }
  
    if(data.modulos.length === 0){
      this.utils.fnMainDialog('Error', 'Please, assign a module to the user.', 'message');
      return;
    }

    this.utils.setLoading(true);
    const prom = (data._id) ? this.usuariosService.put(data._id, data) : this.usuariosService.post(data);
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
      this.utils.fnMessage("La foto de perfil no debe ser mayor a 1MB");
    }

  }

  removerImagen() {
    this.utils.fnMainDialog('Confirmación', '¿Está seguro de remover la foto de perfil?', 'confirm').subscribe(res => {
      if (res) {
        this.mainForm.patchValue({ foto: null });
      }
    })
  }
}
