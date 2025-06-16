import common_site_config from '../../../sites/common_site_config.json';

const { webserver_port } = common_site_config;

const uat = "https://uat.unityedu.tech";

export default {
  '^/(app|api|assets|files|private)': {
    // target: `http://127.0.0.1:${webserver_port}`,
    target: uat,
    ws: true,
    changeOrigin: true,
    router: function (req: any) {
      const site_name = req.headers.host.split(':')[0];
      console.log(req)
      // return `http://${site_name}:${webserver_port}`;
      return uat;
    }
  }
};
