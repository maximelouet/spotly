# Changelog

## [v1.2.2](https://github.com/maximelouet/spotly/tree/v1.2.2) (2020-11-05)

Full list of changes: https://github.com/maximelouet/spotly/compare/v1.2.1...v1.2.2

### Changed

- Remove more Spotify song suffixes to find more lyrics
  ([e64e454](https://github.com/maximelouet/spotly/commit/e64e454828778606df46c94d903bf89dd90b3302))
- Send `Spotly-Version` to the API for easier deployments
  ([a6f3161](https://github.com/maximelouet/spotly/commit/a6f31619489cb6dc80e28708e48ffadbe9d445d0))
- Log more infos in the API, including `Spotly-Version`
  ([0b68052](https://github.com/maximelouet/spotly/commit/0b68052e5d37a2988d0401f85140333181ab481f))
- Add ability to trust proxy forward headers in the API for logging purposes
  ([f398663](https://github.com/maximelouet/spotly/commit/f398663b5ff4a2edba929bcf18c6c7805aa6b93f))
- Simplify Docker builds and improve their settings consistency
  ([6a60503](https://github.com/maximelouet/spotly/commit/6a60503b58e5cc86842692646779eb8fb76625b0))

## [v1.2.1](https://github.com/maximelouet/spotly/tree/v1.2.1) (2020-08-26)

Security release, no new features.

Full list of changes: https://github.com/maximelouet/spotly/compare/v1.2.0...v1.2.1

## [v1.2.0](https://github.com/maximelouet/spotly/tree/v1.2.0) (2020-05-10)

Full list of changes: https://github.com/maximelouet/spotly/compare/v1.1.0...v1.2.0

### Added

- Warn about low song popularity when lyrics are not found
  ([f280444](https://github.com/maximelouet/spotly/commit/f280444a46d77f73d2e49f1f6aa12369fe1106d1))

### Changed

- Display non-breaking spaces when needed to avoid breaking before "?" or "!"
  for example
  ([a563804](https://github.com/maximelouet/spotly/commit/a56380427a6453176c318f723bcb40e443ba9cfd))
- Remove more non-lyrics Genius annotation lines
  ([2f3db4f](https://github.com/maximelouet/spotly/commit/2f3db4f7d1ca5afa6cda990907c9e7d26283cd2a),
  [da35b05](https://github.com/maximelouet/spotly/commit/da35b057c673341b900796c89d0046fa56b61368),
  [9652255](https://github.com/maximelouet/spotly/commit/9652255182e3b855e11ecd81ca69eada4a3004b4))
- Remove more Spotify song suffixes to find more lyrics
  ([86c5312](https://github.com/maximelouet/spotly/commit/86c5312b348e01a5e31665d83b12146ed9f76800))
- Fix lyrics fetching for song/artists containing special characters
  ([846198f](https://github.com/maximelouet/spotly/commit/846198f4049281fe9feb3d112a5d0bcec315ff2f),
  [16f913d](https://github.com/maximelouet/spotly/commit/16f913d93e9cc9a4b230c9b321882702c58969d2),
  [73c6e83](https://github.com/maximelouet/spotly/commit/73c6e830d0318d4962e9af26d7640b9b2fede2d0),
  [0dc3145](https://github.com/maximelouet/spotly/commit/0dc31457f00f6ee13b003c3f4da01f3c31e87734))

## [v1.1.0](https://github.com/maximelouet/spotly/tree/v1.1.0) (2020-05-06)

Full list of changes: https://github.com/maximelouet/spotly/compare/v1.0.0...v1.1.0

### Added

- Dark mode ([2840b9a](https://github.com/maximelouet/spotly/commit/2840b9a161f25fe7e88ad8adb76ac5867604a302))

### Changed

- Remove more Spotify song suffixes to find more lyrics
  ([6bf1e6f](https://github.com/maximelouet/spotly/commit/6bf1e6f18e364df24674b420723afff93fc364a8),
  [bf59e1c](https://github.com/maximelouet/spotly/commit/bf59e1c86247b97f8662aadd25f685f56aebf733))
- Improve Genius lyrics fetching for "feat" songs
  ([23c2609](https://github.com/maximelouet/spotly/commit/23c26099d24380f3e4f470d20e84ce61dce95edc))
- Improve lyrics fetching for artists with special characters such as "+", "&"
  and "ø"
  ([3741465](https://github.com/maximelouet/spotly/commit/37414655629847343579ef9127b08075269d7f0b))
- Fix random Genius lyrics parsing errors resulting in Musixmatch being used
  ([5620398](https://github.com/maximelouet/spotly/commit/5620398e956a4da0535e8145eb34bcba821343bd),
  [a584204](https://github.com/maximelouet/spotly/commit/a584204f2670597d455787e17936f187227bb7e2))
- Fix positioning of "Log in with Spotify" button's Spotify logo on small
  devices, including Kiwi Browser
  ([4039f55](https://github.com/maximelouet/spotly/commit/4039f551b7814f11a48b0d360dc0d63e6dc35478))
- Improve Genius lyrics fetching for artists or songs containing "/" or ":"
  ([85586ab](https://github.com/maximelouet/spotly/commit/85586ab8a53a726a496b13b8bc44c0a286ad8d7d))

## [v1.0.0](https://github.com/maximelouet/spotly/tree/v1.0.0) (2020-05-03)

Initial official release.
