import { isPlatformBrowser }                                                                            from "@angular/common";
import { Inject, Injectable, PLATFORM_ID, signal, Signal }                                              from "@angular/core";
import { takeUntilDestroyed, toSignal }                                                                 from "@angular/core/rxjs-interop";
import { Auth, onAuthStateChanged, User }                                                               from "@angular/fire/auth";
import { collection, CollectionReference, collectionSnapshots, Firestore, QueryDocumentSnapshot }       from "@angular/fire/firestore";
import { UniversityDocument }                                                                           from "@heypoint/interfaces";
import { distinctUntilChanged, filter, map, Observable, Observer, startWith, switchMap, TeardownLogic } from "rxjs";


@Injectable({
  providedIn: "root",
})
export class UniversitiesService {

  public readonly universityDocumentsObservable: Observable<UniversityDocument[]>;
  public readonly universityDocuments$:          Signal<UniversityDocument[]>;

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: object,

    private readonly auth:      Auth,
    private readonly firestore: Firestore,
  ) {
    this
      .universityDocumentsObservable = new Observable<User | null>(
        (userObserver: Observer<User | null>): TeardownLogic => onAuthStateChanged(
          auth,
          (user: User | null): void => userObserver.next(user),
        ),
      ).pipe<User | null, User | null, User, UniversityDocument[], UniversityDocument[]>(
        startWith<User | null, [ User | null ]>(auth.currentUser),
        distinctUntilChanged<User | null>(),
        filter<User | null, User>(
          (user: User | null): user is User => !!user,
        ),
        switchMap<User, Observable<UniversityDocument[]>>(
          (): Observable<UniversityDocument[]> => collectionSnapshots<UniversityDocument>(
            collection(
              firestore,
              "universities",
            ) as CollectionReference<UniversityDocument>,
          ).pipe<UniversityDocument[]>(
            map<QueryDocumentSnapshot<UniversityDocument>[], UniversityDocument[]>((universityQueryDocumentSnapshots: QueryDocumentSnapshot<UniversityDocument>[]): UniversityDocument[] => universityQueryDocumentSnapshots.map((universityQueryDocumentSnapshot: QueryDocumentSnapshot<UniversityDocument>) => universityQueryDocumentSnapshot.data())),
          ),
        ),
        takeUntilDestroyed<UniversityDocument[]>(),
      );
    this
      .universityDocuments$ = isPlatformBrowser(platformId) ? toSignal<UniversityDocument[]>(
        this.universityDocumentsObservable.pipe<UniversityDocument[]>(
          startWith<UniversityDocument[], [ UniversityDocument[] ]>([]),
        ),
        {
          requireSync: true,
        },
      ) : signal<UniversityDocument[]>([]);
  }

}
