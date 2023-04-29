import { User } from "./types";
import { DbAdapter } from "../../core/db/db.adapter";
import {
  ColdObservable,
  ColdObservableOnce,
  HotObservableOnce,
  PaginationList,
} from "../../core/types";
import { DbListResponse, DbQuery, DbSortDirection } from "../../core/db/types";
import { map } from "rxjs/operators";

export class UserService {
  constructor(protected userDb: DbAdapter<User>) {}

  get(id: string): ColdObservableOnce<User> {
    return this.userDb.get(id);
  }

  getChange(id: string): ColdObservable<User> {
    return this.userDb.getChange(id);
  }

  getMany(userIds: string[]): ColdObservable<User[]> {
    return this.userDb.getMany(userIds);
  }

  list(query?: DbQuery): ColdObservableOnce<DbListResponse<User>> {
    return this.userDb.list(query);
  }

  add(user: Partial<User>): HotObservableOnce<User> {
    return this.userDb.add(user);
  }

  update(id: string, user: Partial<User>): HotObservableOnce<void> {
    return this.userDb.update(id, user);
  }

  delete(id: string): HotObservableOnce<void> {
    return this.userDb.delete(id);
  }

  checkEmailExist(email: string): ColdObservableOnce<boolean> {
    return this.userDb
      .list({
        filters: [{ field: "email", comparison: "==", value: email }],
        limit: 1,
      })
      .pipe(map((response) => response.count > 0));
  }

  checkPhoneExist(PhoneNumber: string): ColdObservableOnce<boolean> {
    return this.userDb
      .list({
        filters: [
          { field: "PhoneNumber", comparison: "==", value: PhoneNumber },
        ],
        limit: 1,
      })
      .pipe(map((response) => response.count > 0));
  }

  paginationListOfNewUser(queryOption?): PaginationList<User> {
    const query: DbQuery = this.makeQueryInAdmin("new");

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1
    );
    query.filters.push({ field: "createdAt", comparison: ">=", value: today });
    query.filters.push({
      field: "createdAt",
      comparison: "<",
      value: tomorrow,
    });

    if (queryOption) {
      query.filters.push({
        field: queryOption.field,
        comparison: "==",
        value: queryOption.value,
      });
    }

    return this.userDb.paginationList(query) as unknown as PaginationList<User>;
  }

  private makeQueryInAdmin(type: string): DbQuery {
    const data = {
      sorts: [{ field: "createdAt", direction: DbSortDirection.Desc }],
      filters: [],
    };

    switch (type) {
      case "new":
        const now = new Date();
        const today = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );
        const tomorrow = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 1
        );
        data.filters.push({
          field: "createdAt",
          comparison: ">=",
          value: today,
        });
        data.filters.push({
          field: "createdAt",
          comparison: "<",
          value: tomorrow,
        });
        break;
      case "admin":
        data.filters.push({ field: "isAdmin", comparison: "==", value: true });
        break;
    }

    return data;
  }

  paginationListOfAdmin(): PaginationList<User> {
    const query: DbQuery = this.makeQueryInAdmin("admin");

    return this.userDb.paginationList(query) as unknown as PaginationList<User>;
  }

  getEmail(
    email: string
  ): ColdObservableOnce<
    | { id: number; response: User; status: number }
    | { id: any; response: User; status: number }
  > {
    return this.userDb
      .list({
        filters: [{ field: "email", comparison: "==", value: email }],
        limit: 1,
      })
      .pipe(
        map((response) => {
          const admin = response.docs[0];

          if (!admin) {
            return { status: -1, response: null, id: null };
          }

          if (admin.isAdmin) {
            return { status: 0, response: admin, id: admin.id };
          }

          return {
            status: 200,
            response: admin,
            id: admin.id,
          };
        })
      );
  }
}
