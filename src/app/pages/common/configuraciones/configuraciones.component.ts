import { Component, OnInit } from "@angular/core";
import { UtilsService } from "src/app/shared/services/common/utils.service";
import { ConfiguracionesService } from "src/app/shared/services/configuraciones.service";

@Component({
  selector: 'app-configuraciones',
  templateUrl: './configuraciones.component.html',
  styleUrls: ['./configuraciones.component.scss']
})
export class ConfiguracionesComponent implements OnInit {

  configuraciones: any = {
    palabrasProhibidas: '',
    correosDenuncias: ''
  }

  constructor(
    public utils: UtilsService,
    public configuracionesService: ConfiguracionesService,
  ) { }


  ngOnInit(): void {

    this.utils.fnBreadcrumbsState().setBreadcrumbsState({
      t: 'Global Configurations',
      b: [{ n: 'Global Configurations', r: '/configurations' }]
    });
    this.getConfiguraciones();

  }

  async getConfiguraciones() {
    this.utils.setLoading(true);
    this.configuracionesService.find({}).then((res: any) => {
      this.configuraciones = res.data;
      this.utils.setLoading(false);
    }).catch(err => {
      this.utils.fnMainDialog('Error', "There were an error. Try again later", "message");
      this.utils.setLoading(false);
    });
  }

  updateChanges(){
    this.utils.setLoading(true);
    this.configuracionesService.put(this.configuraciones).then((res: any) => {
      this.utils.fnMainDialog('Confirmation', "Changes applied successfully!", "message");
      this.utils.setLoading(false);
    }).catch(err => {
      this.utils.fnMainDialog('Error', "there were an error. Try again later", "message");
      this.utils.setLoading(false);
    });
  }

}