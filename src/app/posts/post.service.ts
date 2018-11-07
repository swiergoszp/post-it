import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { Post } from './post.model';

const BACKEND_URL = environment.apiURL + '/posts/';

@Injectable({ providedIn: 'root' })
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>();

  // initializes the httpClient module as a method on start up
  constructor(private http: HttpClient, private router: Router) {}

  // retrieves all posts
  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    // telling the http method to expect our json object from the site
    this.http.get<{ message: string; posts: any; maxPosts: number; }>(BACKEND_URL + queryParams)
      .pipe(map((postData) => {
        return {
          posts: postData.posts.map(post => {
            return {
              title: post.title,
              body: post.body,
              id: post._id,
              imagePath: post.imagePath,
              creator: post.creator
            };
          }),
          maxPosts: postData.maxPosts
        };
      }))
      .subscribe(newPosts => {
        this.posts = newPosts.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: newPosts.maxPosts
        });
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string,
      title: string,
      body: string,
      imagePath: string,
      creator: string
    }>(BACKEND_URL + id);
  }

  // adds posts, eventually recieves the form data as its input
  addPost(title: string, body: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('body', body);
    postData.append('image', image, title);
    this.http.post<{ message: string, post: Post }>(BACKEND_URL, postData)
      .subscribe(resData => {
        this.router.navigate(['/']);
      });
  }

  updatePost(id: string, title: string, body: string, image: string | File) {
    let postData: Post | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('body', body);
      postData.append('image', image, title);
    } else {
      postData = {
        id: id,
        title: title,
        body: body,
        imagePath: image,
        creator: null
      };
    }
    this.http.put(BACKEND_URL + id, postData)
      .subscribe(response => {
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    return this.http.delete(BACKEND_URL + postId);
  }
}
