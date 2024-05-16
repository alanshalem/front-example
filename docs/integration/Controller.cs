[Navigation(SaveAsNavegable = true, AddToBackNavigationStack = true, ResetBackNavigationStack = true)]
public async Task<ActionResult> Ini()
{
    ConfigurationHelper configuration = new ConfigurationHelper(ConfigurationHelper.ParsePath(ConfigurationHelper.GetInstance().GetConfig("BGBA.HB.Tarjetas_Path")), false);

    ReactVM reactVM = await ReactHelper.GetReactVM(GetCurrentUser(), GetCurrentUserLogInfo(), configuration, TARJETAS_INI_PATH);

    return View(reactVM);
}

// ReactHelper.cs

public static async Task<ReactVM> GetReactVM(User user, UserLogInfo userLogInfo, ConfigurationHelper configuration, string baseUrl)
{
    var functionalities = ModulesHelper.GetUserFunctionalities(user);
    var functionalitiesReact = functionalities.Find(x => x.Module.Code == (int)HB.Models.App.Framework.LinkedModule.Tarjetas_React).Map(functionalities);

    var getManifestsTask = Task.Run(() => Helpers.Framework.CdnHelper.GetManifests(user, userLogInfo, configuration, baseUrl));
    var getBuildIdTask = Task.Run(() => Helpers.Framework.CdnHelper.GetBuildId(user, userLogInfo, configuration, baseUrl));

    await Task.WhenAll(getBuildIdTask, getManifestsTask);

    List<string> listManifest = await getManifestsTask;
    string buildId = await getBuildIdTask;


    string cdnRoot = CdnHelper.GetReferenceUrlByEnviroment(configuration, user);
    return new ReactVM
    {
        User = JsonConvert.SerializeObject(
                    new Model.Comunes.UserReact(
                        user.FirstName,
                        user.LastName,
                        GenderHelper.GenValByEnum(user.Gender),
                        user.BirthDate.ToBGBADateShortFormat(),
                        ViewHelper.GetSkinNameReact(user.Skin),
                        functionalitiesReact.First(),
                        user.MarketSegment.HasFlag(MarketSegment.Empleado)
                    )
                ),
        Config = JsonConvert.SerializeObject(
                    new Site.Model.Comunes.ConfigReact(
                        baseUrl,
                        new Api(
                            configuration.GetConfig("ApiPath"),
                            false
                        ),
                        configuration.GetConfig("UrlCDNContent"),
                        new CustomerEffort(Helpers.ApplicationHelperCore.GetEstadoCustomerEffort(), user.Skin),
                        new Gtm(Helpers.ApplicationHelperCore.GetEstadoDigitalAnalytics())
                        )
                ),
        CSSRefs = listManifest.FindAll(x => x.IndexOf(".css") > 0),
        JSRefs = listManifest.FindAll(x => x.IndexOf(".js") > 0).OrderBy(x => GetJSRefsOrder(x)).ToList(),
        BuildId = buildId,
        CndRoot = cdnRoot,
    };
}


public static async Task<string> GetBuildId(User user, UserLogInfo userLogInfo, ConfigurationHelper configuration)
{
    if (_buildId == null)
    {
        string urlCDN = configuration.GetBuildIdUrlByEnviroment(user);

        var watch = System.Diagnostics.Stopwatch.StartNew();

        try
        {
            System.Net.HttpWebRequest webrequest = (System.Net.HttpWebRequest)System.Net.WebRequest.Create(urlCDN);
            webrequest.Method = "GET";
            webrequest.ContentLength = 0;

            using (var response = await webrequest.GetResponseAsync())
            {
                watch.Stop();

                var reader = new StreamReader(response.GetResponseStream());
                _buildId = await reader.ReadToEndAsync();

                LogServices.Communicator_TraceHandler(null, new Trace.TraceEventArgs
                {
                    IsError = false,
                    Response = _buildId,
                    URI = urlCDN,
                    ElapsedTime = (int)watch.ElapsedMilliseconds
                },
                    userLogInfo,
                    userLogInfo.DebugActivo,
                    "Consulta buildid react"
                );

            }
        }
        catch (Exception e)
        {
            LogServices.Communicator_TraceHandler(null, new Trace.TraceEventArgs
            {
                ForceDebug = true,
                IsError = true,
                URI = urlCDN,
                ElapsedTime = (int)watch.ElapsedMilliseconds
            },
                userLogInfo,
                userLogInfo.DebugActivo,
                "Consulta buildid react"
            );

            _buildId = null;

            throw new Exceptions.TechnicalException("Error al obtener build id de prestamos react", "GET_BUILDID", e);
        }

    }

    return _buildId;
}

public static async Task<List<string>> GetManifests(User user, UserLogInfo userLogInfo, ConfigurationHelper configuration)
{
    if (_manifests == null)
    {

        string cdnRoot = configuration.GetReferenceUrlByEnviroment(user);
        string cndReference = configuration.GetManifestUrlByEnviroment(user);

        Newtonsoft.Json.Linq.JObject jsonObject = null;
        var watch = System.Diagnostics.Stopwatch.StartNew();


        try
        {
            System.Net.HttpWebRequest webrequest = (System.Net.HttpWebRequest)System.Net.WebRequest.Create(cndReference);

            webrequest.Method = "GET";
            webrequest.ContentLength = 0;


            using (var response = await webrequest.GetResponseAsync())
            {
                watch.Stop();

                var reader = new StreamReader(response.GetResponseStream());
                string received = await reader.ReadToEndAsync();

                jsonObject = Newtonsoft.Json.Linq.JObject.Parse(received);

                _manifests = ((Newtonsoft.Json.Linq.JArray)jsonObject["pages"]["/_app"]).Select(x => cdnRoot + x).ToList();

                LogServices.Communicator_TraceHandler(null, new Trace.TraceEventArgs
                {
                    IsError = false,
                    Response = jsonObject.ToString(),
                    URI = cndReference,
                    ElapsedTime = (int)watch.ElapsedMilliseconds
                },
                    userLogInfo,
                    userLogInfo.DebugActivo,
                    "Consulta manifest react"
                );

            }
        }
        catch (Exception e)
        {
            watch.Stop();

            LogServices.Communicator_TraceHandler(null, new Trace.TraceEventArgs
            {
                ForceDebug = true,
                IsError = true,
                Response = jsonObject.ToString(),
                URI = cndReference,
                ElapsedTime = (int)watch.ElapsedMilliseconds
            },
                userLogInfo,
                userLogInfo.DebugActivo,
                "Consulta manifest react"
            );

            _manifests = null;

            throw new Exceptions.TechnicalException("Error al obtener manifest de prestamos react", "GET_MANIFEST", e);
        }
    }


    return _manifests;
}