import { Component, Input, Injectable, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

@Injectable({ providedIn: 'root' })
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   { title: 'first Post', content: 'This is the first post\'s content' },
  //   { title: 'second Post', content: 'This is the second post\'s content' },
  //   { title: 'thirid Post', content: 'This is the third post\'s content' },
  // ]

  posts: Post[] = [];
  private postsSub: Subscription;
  postsService: PostsService;

  constructor(postsService: PostsService) {
    this.postsService = postsService;
  }

  ngOnInit() {
    this.posts = this.postsService.getPost();
    this.postsSub = this.postsService.getPostUpdatedListener().
      subscribe((posts: Post[]) => {
        this.posts = posts;
      });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }

}
