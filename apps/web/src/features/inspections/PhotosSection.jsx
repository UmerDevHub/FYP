import { LIMITS } from '@v360/shared/constants';
import { useState } from 'react';
import { Button, Field } from '../../components/ui.jsx';
import { useUploadPhoto } from './inspectionHooks.js';

function PhotoUpload({ inspectionId }) {
  const uploadPhoto = useUploadPhoto(inspectionId);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [progress, setProgress] = useState(0);
  const [fileInputKey, setFileInputKey] = useState(0);

  function sendPhoto() {
    setProgress(0);
    uploadPhoto.mutate(
      { file, caption, onProgress: setProgress },
      {
        onSuccess: () => {
          setFile(null);
          setCaption('');
          // A new key empties the file box.
          setFileInputKey(fileInputKey + 1);
        },
      },
    );
  }

  return (
    <div className="mt-4 flex flex-col gap-3 border-t border-line pt-4">
      <label className="flex flex-col gap-1 font-semibold">
        Photo (JPG or PNG, at most {LIMITS.MAX_PHOTO_SIZE_MB} MB)
        <input
          key={fileInputKey}
          type="file"
          accept="image/jpeg,image/png"
          onChange={(event) => setFile(event.target.files[0] ?? null)}
          className="min-h-target font-normal"
        />
      </label>
      <Field
        label="Caption (optional)"
        hint="For example: Dent on the rear bumper."
        value={caption}
        onChange={(event) => setCaption(event.target.value)}
      />
      {uploadPhoto.isPending && (
        <label className="flex flex-col gap-1 text-small">
          Sending the photo: {progress}%
          <progress value={progress} max="100" className="w-full" />
        </label>
      )}
      {uploadPhoto.isError && (
        <p role="alert" className="font-semibold text-fail">
          {uploadPhoto.error.message}
        </p>
      )}
      <Button
        variant="secondary"
        disabled={!file}
        isBusy={uploadPhoto.isPending}
        onClick={sendPhoto}
      >
        Add photo
      </Button>
    </div>
  );
}

// FR-IN-05: the photos of the inspection, and (while it can be changed) a way to add one.
export default function PhotosSection({ inspection, isEditable }) {
  return (
    <section className="mt-8">
      <h2 className="text-section">Photos</h2>
      <p className="mt-1 text-muted">
        {inspection.photos.length} added. At least {LIMITS.MIN_INSPECTION_PHOTOS} are needed to
        submit.
      </p>
      {inspection.photos.length > 0 && (
        <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {inspection.photos.map((photo) => (
            <li key={photo.id}>
              <img
                src={`/api/uploads/${photo.filePath}`}
                alt={photo.caption || 'Inspection photo'}
                loading="lazy"
                className="aspect-[4/3] w-full rounded-control border border-line object-cover"
              />
              {photo.caption && <p className="mt-1 text-small">{photo.caption}</p>}
            </li>
          ))}
        </ul>
      )}
      {isEditable && <PhotoUpload inspectionId={inspection.id} />}
    </section>
  );
}
