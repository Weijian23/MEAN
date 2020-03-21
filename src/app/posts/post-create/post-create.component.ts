import { Component, OnInit, Injectable, OnDestroy } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { mimeType } from "./mime-type.validator";
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})

@Injectable({ providedIn: 'root' })
// used by template driven approach
// export class PostCreateComponent implements OnInit {
//   enteredContent = '';
//   enteredTitle = '';
//   private mode = 'create';
//   private postId: string;
//   post: Post;
//   isLoading = false;


//   constructor(public postsService: PostsService, public route: ActivatedRoute) { }

//   ngOnInit() {
//     this.route.paramMap.subscribe((paramMap: ParamMap) => {
//       if (paramMap.has('postId')) {
//         this.mode = 'edit';
//         this.postId = paramMap.get('postId');
//         this.isLoading = true;
//         this.postsService.getPost(this.postId).subscribe(postData => {
//           this.isLoading = false;
//           this.post = { id: postData._id, title: postData.title, content: postData.content };
//         });
//       }
//       else {
//         this.mode = 'create';
//         this.postId = null;
//       }
//     });
//   }

//   onSavePost(form: NgForm) {
//     if (form.invalid) {
//       return;
//     }
//     this.isLoading = true;
//     if (this.mode === 'create') {
//       this.postsService.addPost(form.value.title, form.value.content);
//     }
//     else {
//       this.postsService.updatePost(this.postId, form.value.title, form.value.content);
//     }

//     form.resetForm();
//   }

// }

// raactive approach
export class PostCreateComponent implements OnInit, OnDestroy {
  myform: FormGroup;
  enteredContent = '';
  enteredTitle = '';
  private mode = 'create';
  private postId: string;
  post: Post;
  isLoading = false;
  imagePreview: string;
  private authStatusSub: Subscription;


  constructor(public postsService: PostsService, public route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
    this.myform = new FormGroup({
      'title': new FormControl(
        null,
        { validators: [Validators.required, Validators.minLength(3)] }
      ),
      'content': new FormControl(
        null,
        { validators: [Validators.required] }
      ),
      'image': new FormControl(
        null,
        { validators: [Validators.required], asyncValidators: [mimeType] }
      )
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath,
            creator: postData.creator
          };
          this.myform.setValue({
            'title': this.post.title,
            'content': this.post.content,
            'image': this.post.imagePath
          });
        });
      }
      else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onImagePicked(eventObj: Event) {
    const myfile = (eventObj.target as HTMLInputElement).files[0];
    this.myform.patchValue({ image: myfile });
    this.myform.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    }
    reader.readAsDataURL(myfile);
  }

  onSavePost() {
    if (this.myform.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postsService.addPost(
        this.myform.value.title,
        this.myform.value.content,
        this.myform.value.image
      );
    }
    else {
      this.postsService.updatePost(
        this.postId,
        this.myform.value.title,
        this.myform.value.content,
        this.myform.value.image);
    }

    this.myform.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}
