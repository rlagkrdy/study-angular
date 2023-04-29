import firebase from 'firebase/compat/app';

export function makeFunctionsService<T>(serviceClass: new (...args: any[]) => T, className?: string): new (...args: any[]) => T {
  const functionName = 'functionsService';
  className = className || serviceClass.name;
  const methodNames = Object.getOwnPropertyNames(serviceClass.prototype);

  for (const methodName of methodNames) {
    serviceClass.prototype[methodName] = async (...args: any[]) => {
      const data = {
        className,
        methodName,
        args
      };

      const response = await firebase.app().functions('asia-northeast3').httpsCallable(functionName)(data);

      return response.data;
    };
  }

  return serviceClass;
}
