"use strict";

exports.handler = (event, context, callback) => {
  const request = event.Records[0].cf.request;
  const headers = request.headers;

  const crawlers = [
    "Googlebot",
    "facebookexternalhit",
    "Twitterbot",
    "bingbot",
    "msnbot",
    "Slackbot"
  ];

  const excludeExtentions = [
    "jpg",
    "png",
    "gif",
    "jpeg",
    "svg",
    "css",
    "js",
    "json",
    "txt",
    "ico",
    "map"
  ];

  const dynamicRenderHeaderName = "X-Need-Dynamic-Render";

  const extention =
    request.uri === null || request.uri === "/"
      ? ""
      : request.uri
          .split(".")
          .pop()
          .toLowerCase();
  const maybeHtml = !excludeExtentions.some(e => e === extention);

  const isCrawler = crawlers.some(c => {
    return headers["user-agent"][0].value.includes(c);
  });

  // UserAgentがクローラーで、かつhtmlへのリクエストだったらカスタムヘッダーをつける
  if (isCrawler && maybeHtml) {
    request.headers[dynamicRenderHeaderName.toLowerCase()] = [
      {
        key: dynamicRenderHeaderName,
        value: "true"
      }
    ];
  }

  callback(null, request);
};
