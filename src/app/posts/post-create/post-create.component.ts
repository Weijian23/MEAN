import { Component, OnInit, Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})

@Injectable({ providedIn: 'root' })
export class PostCreateComponent {
  // ngOnInit(): void {
  //   throw new Error("Method not implemented.");
  // }

  constructor(public postsService: PostsService) { }

  enteredContent = '';
  enteredTitle = '';

  onAddPost(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.postsService.addPost(form.value.title, form.value.content);
    form.resetForm();
  }

}
