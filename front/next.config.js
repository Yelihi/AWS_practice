// const CompressPlugin = require("compression-webpack-plugin"); // 이미 내장중이라 설치 안해도 됨.
// css html 파일들을 gzip 으로 압축 -> 용량이 확 줄어들음. -> 이걸 다시 브라우저가 다시 헤제해서 제공함.
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true", // 이 환경변수가 true 여야 실행됨.
});

module.exports = withBundleAnalyzer({
  compress: true, // 요것도 gzip 해주는 것임
  webpack(config, { webpack }) {
    const prod = process.env.NODE_ENV === "production"; // 배포
    const plugins = [...config.plugins, new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /^\.\/ko$/)];
    // if (prod) {
    //   plugins.push(new CompressPlugin());
    // }
    return {
      ...config,
      mode: prod ? "production" : "development",
      devtool: prod ? "hidden-source-map" : "eval", // 히든으로 해줘야 배포 시 소스 유출 막음
      plugins,
    };
  },
});
