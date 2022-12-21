/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { User } from './models/user.model';
import { AuthError, createUserWithEmailAndPassword, signInWithEmailAndPassword, UserCredential } from 'firebase/auth'
import { doc, DocumentData, DocumentReference, DocumentSnapshot, getDoc, setDoc } from 'firebase/firestore';


@Injectable()
export class AuthService {
    constructor(private firebaseService: FirebaseService) {
		
    }

    public async login(email: string, password: string): Promise<any> {
		try {
			const userCredential: UserCredential = await signInWithEmailAndPassword(
				this.firebaseService.auth,
				email,
				password
			)

			if (userCredential) {
				const id: string = userCredential.user.uid
				const docRef: DocumentReference = doc(this.firebaseService.userCollection, id)
				const snapshot: DocumentSnapshot<DocumentData> = await getDoc(docRef)
				const loggedUser: User = {
					...snapshot.data(),
					id: snapshot.id
				} as User

				delete loggedUser.password

				return userCredential
			}
		} catch (error: unknown) {
			const firebaseError = error as AuthError
			if (firebaseError.code === 'auth/user-not-found') {
				throw new HttpException("User Not Found", HttpStatus.NOT_FOUND);
			}

			if (firebaseError.code === 'auth/wrong-password') {
				throw new HttpException("Incorect User Password", HttpStatus.BAD_REQUEST);
			}
		}
    }

	public async register(body: Omit<User, 'id'>): Promise<any> {
		
		try {
			const userCredential: UserCredential = await createUserWithEmailAndPassword(
				this.firebaseService.auth,
				body.email,
				body.password
			)
	
			if(userCredential) {
				const id: string = userCredential.user.uid
				const docref: DocumentReference = doc(this.firebaseService.userCollection, id)
				setDoc(docref, body)
				return userCredential
			}
			
		} catch (error: unknown) {
			const firebaseError = error as AuthError
			if (firebaseError.code === 'auth/email-already-in-use') {
				throw new HttpException("Email Already in Use", HttpStatus.CONFLICT);
			}
			console.warn(`[ERROR]: ${error}`)
		}
	}
}
