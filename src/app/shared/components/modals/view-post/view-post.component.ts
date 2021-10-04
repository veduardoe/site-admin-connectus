import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ENV } from 'src/environments/environment';
import lgZoom from 'lightgallery/plugins/zoom';
import { PostsService } from 'src/app/shared/services/posts.service';
import { UtilsService } from 'src/app/shared/services/common/utils.service';

@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.scss']
})
export class ViewPostComponent implements OnInit {
  data;
  routeStorage = ENV.STORAGE;
  pathPerfil = '/fotos-perfil%2F';
  pathFichero = '/ficheros%2F';
  host = ENV.SITEHOST;
  listadoImagenes = [];
  listadoFicheros = [];
  settings = {
    counter: false,
    plugins: [lgZoom]
  }
  constructor(
    @Inject(MAT_DIALOG_DATA) public input: { data: any },
    public postsService: PostsService,
    public utils:UtilsService
    ) {

    this.data = this.input.data;
    
    if (this.data?.post.ficheros.length > 0) {

      this.data?.post.ficheros.forEach((val, key) => {
        if (val.type === 'pic') {
          this.listadoImagenes.push({
            image: this.routeStorage + this.pathFichero + val.file + '?alt=media',
            src: this.routeStorage + this.pathFichero + val.file + '?alt=media'
          });
        }
        if (val.type === 'doc') {
          this.listadoFicheros.push({
            file: this.routeStorage + this.pathFichero + val.file + '?alt=media',
            nombre: val.nombre
          });
        }
      });

    }

  }

  ngOnInit(): void {

  }

  changeStatus(status){
    this.postsService.setStatusPost(this.data.post._id, status).then( (res:any) => {
      if(res.response){
        this.data.post.estado = status;
      }else{
        this.utils.fnError()
      }
    }).catch( err => {
      this.utils.fnError()
    });
  }

}
