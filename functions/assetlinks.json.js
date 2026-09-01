export async function onRequest(context) {
  const data = [
    {
      "relation": [
        "delegate_permission/common.handle_all_urls",
        "delegate_permission/common.get_login_creds"
      ],
      "target": {
        "namespace": "android_app",
        "package_name": "com.saninabbas.viddownloader",
        "sha256_cert_fingerprints": [
          "1B:B5:72:A1:6A:58:A7:6B:E9:23:C0:DB:7E:14:93:35:82:82:9F:03:E4:7C:AA:9F:6D:DB:DC:A9:AF:44:8A:78"
        ]
      }
    }
  ];

  return new Response(JSON.stringify(data, null, 2), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
      "access-control-allow-origin": "*",
      "cache-control": "public, max-age=0, must-revalidate"
    }
  });
}
