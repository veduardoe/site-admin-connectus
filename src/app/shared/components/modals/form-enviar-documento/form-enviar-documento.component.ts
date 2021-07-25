import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UtilsService } from 'src/app/shared/services/common/utils.service';
import { PropiedadesService } from 'src/app/shared/services/propiedades/propiedades.service';

@Component({
  selector: 'app-form-enviar-documento',
  templateUrl: './form-enviar-documento.component.html',
  styleUrls: ['./form-enviar-documento.component.scss']
})
export class FormEnviarDocumentoComponent implements OnInit {

  datos = {
    nombre: null,
    email: null,
    documento: null
  };

  @Output() dialogEvent: EventEmitter<any> = new EventEmitter();

  constructor(
    private propiedadesService: PropiedadesService,
    private utils: UtilsService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public input: { documento: any },
  ) { 
    this.datos.documento = this.input.documento;
  }

  ngOnInit(): void {
    


  }

  save(){

    if(!this.datos.nombre || !this.datos.documento || !this.datos.email){
      this.utils.fnMainDialog("Error", "Datos son obligatorios. Revise e intente de nuevo", "message");
      return;
    }

    if(!this.utils.validateEmail(this.datos.email)){
      this.utils.fnMainDialog("Error", "Email es incorrecto. Revise e intente nuevamente.", "message");
      return;
    }

    this.propiedadesService.enviarDocumento(this.datos).then( res => {
      this.dialogEvent.emit(true);
    });
  } 

}
