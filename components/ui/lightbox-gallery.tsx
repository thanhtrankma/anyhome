"use client";

import Lightbox, { type SlideImage } from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/plugins/counter.css";

/** Xem ảnh độ phân giải cao: zoom (pinch/scroll), vuốt, phím mũi tên. */
export function LightboxGallery({
  slides,
  index,
  onClose,
}: {
  slides: SlideImage[];
  index: number;
  onClose: () => void;
}) {
  return (
    <Lightbox
      open={index >= 0}
      index={Math.max(index, 0)}
      close={onClose}
      slides={slides}
      plugins={[Zoom, Captions, Counter]}
      zoom={{ maxZoomPixelRatio: 3, scrollToZoom: true }}
      captions={{ descriptionTextAlign: "center" }}
      styles={{ container: { backgroundColor: "rgba(13,16,32,.96)" } }}
      controller={{ closeOnBackdropClick: true }}
    />
  );
}
