import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ENV } from "src/environments/environment";

@Injectable()
export class PostsService {

    constructor(
        private http: HttpClient
    ) { }

    getPosts(data) {
        let str = Object.entries(data).map(([key, val]) => `${key}=${val}`).join('&');
        return this.http.get(ENV.BACKEND + '/posts/admin?' + str).toPromise();
    }

    getComentarios(data) {
        let str = Object.entries(data).map(([key, val]) => `${key}=${val}`).join('&');
        return this.http.get(ENV.BACKEND + '/posts/comentarios?' + str).toPromise();
    }

    setStatusPost(idPost, status) {
        return this.http.put(ENV.BACKEND + '/posts/admin/status/' + idPost, { status }).toPromise();
    }

}