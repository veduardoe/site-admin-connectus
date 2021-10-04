import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ArticulosService } from 'src/app/shared/services/articulos.service';
import { CategoriasService } from 'src/app/shared/services/categorias.service';
import { UtilsService } from 'src/app/shared/services/common/utils.service';
import { ENV } from 'src/environments/environment';

@Component({
  selector: 'app-form-articulospublicos',
  templateUrl: './form-articulospublicos.component.html',
  styleUrls: ['./form-articulospublicos.component.scss']
})
export class FormArticulosPublicosComponent implements OnInit {

  estados = [{ id: 'ACTIVE', value: true }, { id: 'INACTIVE', value: false }];
  idiomas = [{ id: 'ESPAÑOL', value: 'ES' }, { id: 'ENGLISH', value: 'EN' }];
  routeStorage = ENV.STORAGE;
  pathFicheros = '/articulospublicos%2F'
  categorias = [];

  @Output() dialogEvent: EventEmitter<any> = new EventEmitter();

  mainForm = new FormGroup({
    _id: new FormControl(null),
    tituloSlider: new FormControl(null, [Validators.required]),
    descripcionSlider: new FormControl(null, [Validators.required]),
    imagenSlider: new FormControl(null, [Validators.required]),
    sec1_titulo: new FormControl(null, [Validators.required]),
    sec1_descripcion: new FormControl(null, [Validators.required]),
    sec1_url: new FormControl(null),
    sec1_habilitarUrl: new FormControl(null, [Validators.required]),
    sec2_icono: new FormControl(null, [Validators.required]),
    sec2_titulo: new FormControl(null, [Validators.required]),
    sec2_descripcion: new FormControl(null, [Validators.required]),
    sec2_url: new FormControl(null),
    sec2_habilitarUrl: new FormControl(null, [Validators.required]),
    sec3_titulo: new FormControl(null, [Validators.required]),
    sec3_descripcion: new FormControl(null, [Validators.required]),
    sec3_url: new FormControl(null, [Validators.required]),
    sec3_habilitarUrl: new FormControl(null, [Validators.required]),
    sec3_imagen: new FormControl(null, [Validators.required]),
    sec3_infos: new FormGroup({
      items: new FormArray([
        new FormGroup({
          icon: new FormControl(''),
          tituloCorto: new FormControl(''),
          tituloLargo: new FormControl(''),
          descripcion: new FormControl(''),
          url: new FormControl(''),
          habilitarUrl: new FormControl(''),
        }),
        new FormGroup({
          icon: new FormControl(''),
          tituloCorto: new FormControl(''),
          tituloLargo: new FormControl(''),
          descripcion: new FormControl(''),
          url: new FormControl(''),
          habilitarUrl: new FormControl(''),
        }),
        new FormGroup({
          icon: new FormControl(''),
          tituloCorto: new FormControl(''),
          tituloLargo: new FormControl(''),
          descripcion: new FormControl(''),
          url: new FormControl(''),
          habilitarUrl: new FormControl(''),
        }),
        new FormGroup({
          icon: new FormControl(''),
          tituloCorto: new FormControl(''),
          tituloLargo: new FormControl(''),
          descripcion: new FormControl(''),
          url: new FormControl(''),
          habilitarUrl: new FormControl(''),
        })
      ])
    }),
    sec4_titulo: new FormControl(null, [Validators.required]),
    sec4_descripcion: new FormControl(null, [Validators.required]),
    sec4_url: new FormControl(null, [Validators.required]),
    sec4_habilitarUrl: new FormControl(null, [Validators.required]),
    sec4_imagen: new FormControl(null, [Validators.required]),
    idCategoria: new FormControl(null, [Validators.required]),
    mostrarEnSlide: new FormControl(null, [Validators.required]),
    habilitar: new FormControl(null, [Validators.required]),
    slug: new FormControl(null, [Validators.required]),
    idioma: new FormControl(null, [Validators.required]),
    posicion: new FormControl(1, [Validators.required]),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public input: { data: any },
    public utils: UtilsService,
    public articulosService: ArticulosService,
    public categoriasService: CategoriasService
  ) {
    if (this.input.data) {
      let data = this.input.data;
      data.sec3_infos.items = data.sec3_infos;
      this.mainForm.patchValue(data);
    }

  }

  ngOnInit(): void {
    this.getCategorias();
  }

  getCategorias(){
    this.categoriasService.find({}).then((res:any) => {
      this.categorias = res.data;
    });
  }

  save() {

    const data = this.mainForm.getRawValue();

    this.triggedValidation(true);

    if (!data.sec3_imagen || !data.imagenSlider ||  !data.sec4_imagen ) {
      this.utils.fnMainDialog("Error", "You must select all the pictures.", "message");
    }

    if (!this.mainForm.valid) {
      return;
    }

    this.utils.setLoading(true);

    const prom = (data._id) ? this.articulosService.put(data._id, data) : this.articulosService.post(data);
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

    if (size < 10000) {

      reader.readAsDataURL(file);
      reader.onload = () => {

        let file64 = String(reader.result).split(";");
        let fichero = String(reader.result);
        let mimetype = file64[0].split(":")[1];
        const mimeTypeImagenes = mimetype == "image/jpg" || mimetype == "image/jpeg" || mimetype == "image/gif" || mimetype == "image/png";

        if (mimeTypeImagenes) {
          this.mainForm.patchValue({ [id]: fichero });
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
        this.mainForm.patchValue({ [id]: null });
      }
    })
  }
}
