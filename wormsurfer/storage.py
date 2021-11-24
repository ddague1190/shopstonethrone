from whitenoise.storage import CompressedManifestStaticFilesStorage


class WhiteNoisenNoManifest(CompressedManifestStaticFilesStorage):
    manifest_strict = False
