import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { FormAdministradoresComponent } from "../../components/modals/form-administradores/form-administradores.component";
import { UsuariosService } from "../usuarios.service";
import { UtilsService } from "./utils.service";

@Injectable()
export class PerfilService{

    constructor(
        private utils: UtilsService,
        private usuariosService: UsuariosService,
        private dialog: MatDialog
    ){}

    openFormPerfilAdmin(id: string = null, from = null) {

        return new Promise(async (resolve, reject) => {
    
            let data = null;
    
            if (id) {
              try {
                const req = from ? this.usuariosService.findMisDatos() : this.usuariosService.find({ _id: id });
                const reqData: any = await req;
                data = reqData.data[0];
                data.from = from;
              } catch (err) {
                this.utils.fnMainDialog("Error", "No se encontró el Administrador seleccionado.", "message");
                return false;
              }
            }
        
            const dForm = this.dialog.open(FormAdministradoresComponent, {
              width: '90%',
              maxWidth: '720px',
              data: { data },
              autoFocus: false,
              disableClose: true
            });
        
            dForm.componentInstance.dialogEvent.subscribe((result) => {
              this.dialog.closeAll();
              this.utils.fnSuccessSave();
              resolve(true);
            });
    
        });
    
      }

    
}