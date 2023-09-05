declare global {
  interface Window {
    __onGoogleLoaded: (event: Event) => void;
  }
}
export class MapLoaderService {
  private static promise: Promise<any>;
  public static load(): Promise<any> {
    let browserKey = "AIzaSyB1hde-5CDelK8n5aMiRecPOcl4i_nx0EE";
    let map = {
      URL: 'https://maps.googleapis.com/maps/api/js?libraries=geometry,drawing&key=' + browserKey + '&callback=__onGoogleLoaded',
    }

    // First time 'load' is called?
    if (!this.promise) {

      // Make promise to load
      this.promise = new Promise(resolve => {
        this.loadScript(map.URL);
        // Set callback for when google maps is loaded.
        window['__onGoogleLoaded'] = (event: Event) => {
          resolve('google maps api loaded');
        };
      })
    }

    // Always return promise. When 'load' is called many times, the promise is already resolved.
    return this.promise;
  }

  //this function will work cross-browser for loading scripts asynchronously
  static loadScript(src: string, callback?: () => void): void {
    var s: any,
      t;
    let r: boolean = false;
    s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = src;
    s.onload = s.onreadystatechange = function () {
      if (!r && (!this.readyState || this.readyState == 'complete')) {
        r = true;
        if (typeof callback === "function")
          callback();
      }
    };
    t = document.getElementsByTagName('script')[0];
    if (t && t.parentNode) {
      t.parentNode.insertBefore(s, t);
    }
  }
}
