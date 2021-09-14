using BPMS.Business;
using BPMS.Entity;
using BPMS.IBusiness;
using DotNet.Utilities;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using BPMS.Service;
using System.Data;
using System.Text;
using BPMS.WEB.hl;
using System.IO;
using Newtonsoft.Json.Linq;

namespace BPMS.WEB.Three_hospital.lchljl
{
    public partial class hl_print2 : hlPagebase
    {
        public SessionUser UserInfo;
        protected void Page_Load(object sender, EventArgs e)
        {
            UserInfo = RequestSession.GetSessionUser();
            if (!String.IsNullOrEmpty(HttpContext.Current.Request["action"]))
            {
                string action = HttpContext.Current.Request["action"].ToString();
                string key = Request["zyh"];
                // 处理异步请求
                switch (action)
                {
                    case "LoadAuto":
                        {
                            string str = string.Empty;
                            StringBuilder sb = new StringBuilder();
                            sb.AppendFormat("select * from PMS_lchljl where zyh='{0}'", key);
                            DataTable dt = DataFactory.SqlHelper().GetDataTableBySQL(sb);
                            if (DataTableHelper.IsExistRows(dt))
                            {
                                str = JsonHelper.DataTableToJson(dt, "d");
                            }
                            Response.Write(str);
                            Response.End();
                            break;
                        }
                }
            }

        }
    }
}