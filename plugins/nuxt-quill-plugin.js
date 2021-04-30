import Vue from 'vue'
import Quill from 'quill'
import VueQuillEditor from 'vue-quill-editor'
import ImageResize from 'quill-image-resize-module'
import ImageUploader from "quill-image-uploader"

var BaseImageFormat = Quill.import('formats/image');
const ImageFormatAttributesList = [
    'alt',
    'height',
    'width',
    'style'
];

class ImageFormat extends BaseImageFormat {
  static formats(domNode) {
    return ImageFormatAttributesList.reduce(function(formats, attribute) {
      if (domNode.hasAttribute(attribute)) {
        formats[attribute] = domNode.getAttribute(attribute);
      }
      return formats;
    }, {});
  }
  format(name, value) {
    if (ImageFormatAttributesList.indexOf(name) > -1) {
      if (value) {
        this.domNode.setAttribute(name, value);
      } else {
        this.domNode.removeAttribute(name);
      }
    } else {
      super.format(name, value);
    }
  }
}


import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'

Quill.register(ImageFormat, true);
Quill.register("modules/imageUploader", ImageUploader);
Quill.register('modules/imageResize', ImageResize)
// Quill.register('modules/imageDrop', ImageDrop)
// Quill.register(new Parchment.Attributor.Style('display', 'display', {
//   whitelist: ['inline']
// }));
// Quill.register(new Parchment.Attributor.Style('float', 'float', {
//   whitelist: ['left', 'right', 'center']
// }));
// Quill.register(new Parchment.Attributor.Style('margin', 'margin', {}));

Vue.use(VueQuillEditor)
