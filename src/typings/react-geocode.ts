declare module 'react-geocode' {
  namespace Geocode {
    export interface GoogleMapResponse {
      results: google.maps.GeocoderResult[],
      status: google.maps.GeocoderStatus
    }

    export const fromAddress: (address: string) => Promise<GoogleMapResponse>
    export const setApiKey: (apiKey: string) => void
  }

  export = Geocode
}
