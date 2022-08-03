declare global {
   /*~ Here, declare things that go in the global namespace, or augment
   *~ existing declarations in the global namespace
   */
   type ModelType<T1, T2, T3> = Omit<Omit<T1, keyof T2> & T2, keyof T3> & Partial<T3>;
   type valueOf<T> = T[keyof T];
   type StringValueOf<T> = T[keyof T] & string;
   declare namespace Express {
      export interface Request {
         user?: any,
         'x-app-fingerprint'?: string,
         'x-app-cart'?: string
      }
   }
}
export {}