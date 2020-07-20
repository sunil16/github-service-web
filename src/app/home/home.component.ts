import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CoreService } from 'src/app/core.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  repo = [];
  followers = [];
  current_repo_name: string = "";
  current_desc: string = "";
  github_username: string;
  prev_repo_link: string = "";
  next_repo_link: string = "";
  prev_follw_link: string = "";
  next_follw_link: string = "";
  top_follower: object = {};

    constructor(private fb : FormBuilder, public service : CoreService ) { }
    searchForm = this.fb.group({
      github_username:''
    })

    newRepoForm = this.fb.group({
      name:'',
      description:'',
      git_username: '',
      git_password: ''
    })

    updateRepoForm = this.fb.group({
      name:'',
      description:'',
      git_username: '',
      git_password: ''
    })
    ngOnInit() {

    }

    searchName(): void{
      let githubName = this.searchForm.value.github_username
      this.service.getRepoFollow(githubName).subscribe(res=>{
        console.log(res)
        if('followers' in res.followers)
          this.followers = res.followers.followers;
        if('top_follower' in res.followers)
          this.top_follower = res.followers.top_follower
        if('links' in res.followers){
          if('prev' in res.followers.links)
            this.prev_follw_link = res.followers.links.prev.url
          if('next' in res.followers.links)
            this.next_follw_link = res.followers.links.next.url
        }
        if('repo' in res.repository){
          this.repo = res.repository.repo
          if('prev' in res.repository.links)
            this.prev_repo_link = res.repository.links.prev.url
          if('next' in res.repository.links)
            this.next_repo_link = res.repository.links.next.url
        }
      })
    }

    createRepo(): void{
      this.service.createRepo(this.newRepoForm.value).subscribe(res=>{
        alert(res.message)
        $('.modal').modal('hide');
      })
    }

    updateRepo(): void{
      if(this.updateRepoForm.value.description != "") {
        this.updateRepoForm.value['name'] = this.current_repo_name
        this.service.updateRepo(this.updateRepoForm.value).subscribe(res=>{
          alert(res.message)
          $('.modal').modal('hide');
        })
      }
      else{
        $('.modal').modal('hide');
      }
    }

    currentRepo(repo): void{
      this.current_repo_name = repo.name
      this.current_desc = repo.description
    }

    nextPage(page_type,direction): void {
      console.log(page_type,this.next_repo_link)
      let paging_url = ''
      if(page_type == 'repo'){
        if(direction == 'next' )
          paging_url = this.next_repo_link
        else
          paging_url = this.prev_repo_link
      }
      else if(page_type == 'follw'){
        if(direction == 'next' )
          paging_url = this.next_follw_link
        else
          paging_url = this.prev_follw_link
      }

      if(page_type == 'repo' && paging_url != ""){
        this.service.getNextPage(paging_url,page_type).subscribe(res=>{
          console.log(res)
          if('repo' in res.repository){
            this.repo = res.repository.repo
          }
          if('links' in res.repository){
            if('prev' in res.repository.links)
              this.prev_repo_link = res.repository.links.prev.url
            else
              this.prev_repo_link = ""
            if('next' in res.repository.links)
              this.next_repo_link = res.repository.links.next.url
            else
              this.next_repo_link = ""
          }
        })
      }
      else if (page_type == 'follw' && paging_url != ""){
        this.service.getNextPage(paging_url ,page_type).subscribe(res=>{
          console.log(res)
          if('followers' in res.followers)
            this.followers = res.followers.followers;
          if('links' in res.followers){
            if('prev' in res.followers.links)
              this.prev_follw_link = res.followers.links.prev.url
            else
              this.prev_follw_link = ""
            if('next' in res.followers.links)
              this.next_follw_link = res.followers.links.next.url
            else
              this.next_follw_link = ""
          }
        })
      }
    }

    // prev_page(page_type): void {
    //   if(page_type=='repo' && this.prev_repo_link != ""){
    //     this.service.getNextPage(this.prev_repo_link, page_type).subscribe(res=>{
    //       console.log(res)
    //       if()
    //       this.repo = res.repository.repo
    //       if('prev' in res.repository.links)
    //         this.prev_repo_link = res.repository.links.prev.url
    //       else
    //         this.prev_repo_link = ""
    //       if('next' in res.repository.links)
    //         this.next_repo_link = res.repository.links.next.url
    //       else
    //         this.next_repo_link = ""
    //     })
    //   }
    //   else if(page_type=='follw' && this.prev_follw_link != ""){
    //     this.service.getNextPage(this.prev_follw_link, page_type).subscribe(res=>{
    //       console.log(res)
    //       this.followers = res.followers.followers;
    //       if('prev' in res.followers.links)
    //         this.prev_follw_link = res.followers.links.prev.url
    //       else
    //         this.prev_follw_link = ""
    //       if('next' in res.followers.links)
    //         this.next_follw_link = res.followers.links.next.url
    //       else
    //         this.next_follw_link = ""
    //     })
    //   }
    // }
}
