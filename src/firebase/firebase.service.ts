/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist';
import { FirebaseApp, initializeApp } from 'firebase/app'
import { Auth, getAuth } from 'firebase/auth';
import { CollectionReference, collection, Firestore, getFirestore } from 'firebase/firestore'
import { Config } from 'src/auth/models/config.model';

@Injectable()
export class FirebaseService {
    public app: FirebaseApp;
    public auth: Auth;
    public firestore: Firestore

    // collections
    public userCollection: CollectionReference

    constructor(private configService: ConfigService<Config>) {
        this.app = initializeApp({
            apiKey: configService.get<string>('apiKey'),
            appId: configService.get<string>('appId'),
            authDomain: configService.get<string>('authDomain'),
            measurementId: configService.get<string>('measurementId'),
            messagingSenderId: configService.get<string>('messagingSenderId'),
            projectId: configService.get<string>('projectId'),
            storageBucket: configService.get<string>('storageBucket'),
        })

        this.auth = getAuth(this.app)
        this.firestore = getFirestore(this.app)
        this._createCollections()
    }

    private _createCollections() {
        this.userCollection = collection(this.firestore, 'users')
    }
}
