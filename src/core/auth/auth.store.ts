import { Store, Query } from '@datorama/akita';
import { AkitaStoreAdapter } from '../../modules/akita/akita-store.adapter';
import { AuthState, authStoreInitialValue } from './auth.state';

const store = new Store(authStoreInitialValue, { name: 'auth' });
const query = new Query(store);

export class AuthStore extends AkitaStoreAdapter<AuthState> {
  constructor() {
    super(store, query);
  }
}
