import { Observable, from } from "rxjs";
import { StorageAdapter } from "../../core/storage/storage.adapter";
import { UploadTask } from "../../core/storage/types";
import { ColdObservableOnce } from "../../core/types";
import { generateId } from "../../core/utils";
import firebase from "firebase/compat/app";

export class FirebaseStorageAdapter implements StorageAdapter {
  constructor(private storage: firebase.storage.Storage) {}

  upload(
    data: File | Blob | string,
    dir?: string,
    fileName?: string
  ): UploadTask {
    if (!data) {
      throw new Error("data argument is required");
    }

    if (!dir) {
      dir = this.generateDir();
    }

    if (!fileName) {
      fileName = this.generateFileName(data);
    }

    const filePath = `${dir}/${fileName}`;

    let ref: firebase.storage.Reference;
    let task: firebase.storage.UploadTask;

    if (typeof data === "string") {
      ref = this.storage.ref(filePath);
      task = ref.putString(data);
    } else {
      ref = this.storage.ref(filePath);
      task = ref.put(data, { contentType: data.type });
    }

    return {
      filePath,
      pause: task.pause,
      resume: task.resume,
      cancel: task.cancel,
      percentageChange: () =>
        new Observable((subscriber) => {
          task.on(
            firebase.storage.TaskEvent.STATE_CHANGED,
            (snap) =>
              subscriber.next(
                Math.floor(snap.bytesTransferred / snap.totalBytes)
              ),
            (err) => subscriber.error(err),
            () => subscriber.complete()
          );
        }),
      getDownloadURL: () =>
        new Observable((subscriber) => {
          task
            .then((snap) => {
              return snap.ref.getDownloadURL();
            })
            .then((url) => {
              subscriber.next(url);
              subscriber.complete();
            })
            .catch((err) => subscriber.error(err));
        }),
    };
  }

  getDownloadURL(filePath: string): ColdObservableOnce<string> {
    return from(this.storage.ref(filePath).getDownloadURL());
  }

  removeFile(url: string) {
    const splitUrl = url.split("/o/");
    const refUrl: string = splitUrl[splitUrl.length - 1].split("?")[0];

    this.storage
      .ref(decodeURIComponent(refUrl))
      .delete()
      .then(() => console.log("삭제 성공"))
      .catch(() => console.log("삭제 실패"));
  }

  getFileName(url: string): string {
    return this.storage.refFromURL(url).name;
  }

  generateDatePath(name: string): string {
    return `${Date.now().toString(16)}`;
  }

  private generateDir(): string {
    const now = new Date();
    return `temp/${now.getFullYear()}/${now.getMonth() + 1}`;
  }

  private generateFileName(data: File | Blob | string): string {
    let name: string;
    let ext = ".";

    if (data instanceof File) {
      const splitName = data.name.split(".");
      name = this.generateName(splitName[0]);
      ext += splitName[splitName.length - 1];
    } else if (data instanceof Blob) {
      name = this.generateName(generateId(4));
      if (data.type === "unknown") {
        ext = "";
      } else {
        ext += data.type.split("/")[1];
      }
    } else if (typeof data === "string") {
      name = this.generateName(generateId(4));
      ext = "";
    } else {
      throw new Error("data argument type is incorrect");
    }

    return `${name}${ext}`;
  }

  private generateName(name: string): string {
    return `${Date.now().toString(16)}-${name}`;
  }
}
