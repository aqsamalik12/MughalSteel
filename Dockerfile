FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY ["MughalSteelBackEndApplicationApi/MughalSteelApi/MughalSteelApi/MughalSteelApi.csproj", "MughalSteelBackEndApplicationApi/MughalSteelApi/MughalSteelApi/"]
RUN dotnet restore "MughalSteelBackEndApplicationApi/MughalSteelApi/MughalSteelApi/MughalSteelApi.csproj"

COPY . .
WORKDIR "/src/MughalSteelBackEndApplicationApi/MughalSteelApi/MughalSteelApi"
RUN dotnet publish "MughalSteelApi.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "MughalSteelApi.dll"]
