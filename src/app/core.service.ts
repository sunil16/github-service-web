import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class CoreService {

  baseUrl = 'http://localhost:8000/git/';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  constructor(private http: HttpClient) {
  }

  getRepoFollow(username: string): Observable<any> {
    if(username != '' && username != undefined && username != null){
      return  this.http.get(this.baseUrl +'get_repo?github_username=' + username )
    }
  }

  createRepo(object): Observable<any> {
      const repoInfo = {name: object.name, description: object.description, client_id: object.git_username, client_secret: object.git_password};
      return this.http.post(this.baseUrl + 'create_repo', repoInfo);
    }

  updateRepo(object): Observable<any> {
      const repoInfo = {repo_name: object.name, description: object.description, client_id: object.git_username, client_secret: object.git_password};
      return this.http.post(this.baseUrl + 'update_repo', repoInfo);
    }

  getNextPage(paging_url: string, page_type: string): Observable<any> {
      if(paging_url != "" && paging_url != undefined && paging_url != null){
        if(page_type == 'repo'){
          const repoInfo = {follower_paging_url: "", repo_paging_url: paging_url};
          return this.http.post(this.baseUrl + 'get_next_page', repoInfo);
        }
        else{
          const repoInfo = {follower_paging_url: paging_url, repo_paging_url: ""};
          return this.http.post(this.baseUrl + 'get_next_page', repoInfo);
        }
      }
    }

  }
