FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

WORKDIR /src

COPY ["MughalSteelApi.csproj", "./"]

RUN dotnet restore

COPY . .

RUN dotnet publish "MughalSteelApi.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final

WORKDIR /app

EXPOSE 8080

ENV ASPNETCORE_URLS=http://+:8080
ENV DOTNET_USE_POLLING_FILE_WATCHER=true
ENV DOTNET_HOSTBUILDER__RELOADCONFIGONCHANGE=false

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "MughalSteelApi.dll"]