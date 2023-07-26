import { OrderPhoto } from './types'

/*
 Fake data and mock functions
 TODO: remove when integrdated with backend
*/

export const generateMockPhoto = (file: File): OrderPhoto => ({
  date: '06/23/18',
  fileName: 'some-filename.jpg',
  fullUrl: URL.createObjectURL(file),
  hidden: false,
  id: Date.now(),
  inVideo: false,
  star: false,
  thumbUrl: URL.createObjectURL(file),
  title: '',
  webUrl: URL.createObjectURL(file)
})

export const mockOrderPhotos: OrderPhoto[] = [{
  date: '06/23/18',
  fileName: 'some-filename.jpg',
  fullUrl: 'https://picsum.photos/1280/960?image=1081',
  hidden: true,
  id: 1,
  inVideo: false,
  star: false,
  thumbUrl: 'https://picsum.photos/640/480?image=1081',
  title: 'Lorem ipsum',
  webUrl: ''
}, {
  date: '06/23/18',
  fileName: 'some-filename.jpg',
  fullUrl: 'https://picsum.photos/1280/960?image=1040',
  hidden: false,
  id: 2,
  inVideo: true,
  star: true,
  thumbUrl: 'https://picsum.photos/640/480?image=1040',
  title: '',
  webUrl: ''
}, {
  date: '06/23/18',
  fileName: 'some-filename.jpg',
  fullUrl: 'https://picsum.photos/1280/960?image=1078',
  hidden: false,
  id: 3,
  inVideo: true,
  star: false,
  thumbUrl: 'https://picsum.photos/640/480?image=1078',
  title: '',
  webUrl: ''
}, {
  date: '06/23/18',
  fileName: 'some-filename.jpg',
  fullUrl: 'https://picsum.photos/1280/960?image=1031',
  hidden: false,
  id: 4,
  inVideo: false,
  star: true,
  thumbUrl: 'https://picsum.photos/640/480?image=1031',
  title: 'Some test caption',
  webUrl: ''
}, {
  date: '06/23/18',
  fileName: 'some-filename.jpg',
  fullUrl: 'https://picsum.photos/1280/960?image=946',
  hidden: false,
  id: 5,
  inVideo: false,
  star: false,
  thumbUrl: 'https://picsum.photos/640/480?image=946',
  title: '',
  webUrl: ''
}, {
  date: '06/23/18',
  fileName: 'some-filename.jpg',
  fullUrl: 'https://picsum.photos/1280/960?image=859',
  hidden: false,
  id: 6,
  inVideo: false,
  star: true,
  thumbUrl: 'https://picsum.photos/640/480?image=859',
  title: '',
  webUrl: ''
}, {
  date: '06/23/18',
  fileName: 'some-filename.jpg',
  fullUrl: 'https://picsum.photos/1280/960?image=249',
  hidden: false,
  id: 7,
  inVideo: false,
  star: true,
  thumbUrl: 'https://picsum.photos/640/480?image=249',
  title: '',
  webUrl: ''
}]
