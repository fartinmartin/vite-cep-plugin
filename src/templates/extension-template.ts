import type { CEP_Extended_Panel } from "../types/cep-config";

export const extensionTemplate = ({
  id,
  parameters,
  mainPath,
  type,
  host,
  displayName,
  window,
  icons,
  scriptPath,
  startOnEvents,
}: CEP_Extended_Panel) => {
  const {
    autoVisible,
    height,
    maxHeight,
    maxWidth,
    minHeight,
    minWidth,
    width,
  } = window;
  const { darkNormal, darkNormalRollOver, normal, normalRollOver } = icons;
  return `<Extension Id="${id}">
<DispatchInfo${host ? ` Host="${host}"` : ""}>
  <Resources>
    <MainPath>${mainPath}</MainPath>${
    (scriptPath && `<ScriptPath>${scriptPath}</ScriptPath>`) || ""
  }<CEFCommandLine>${
    (parameters &&
      parameters
        .map((item) => `\n<Parameter>${item.toString()}</Parameter>`)
        .join("")) ||
    ""
  }
    </CEFCommandLine>
  </Resources>
  <Lifecycle>
    <AutoVisible>${autoVisible}</AutoVisible>${
    (startOnEvents &&
      `<StartOn>${startOnEvents
        .map((event) => `\n<Event>${event}</Event>`)
        .join("")}</StartOn>`) ||
    ""
  }
  </Lifecycle>
  <UI>
    <Type>${type}</Type>
    ${displayName ? `<Menu>${displayName}</Menu>` : ""}
    <Geometry>${
      width && height
        ? `<Size>
        <Width>${width}</Width>
        <Height>${height}</Height>
      </Size>`
        : ""
    }${
    maxWidth && maxHeight
      ? `<MaxSize>
        <Width>${maxWidth}</Width>
        <Height>${maxHeight}</Height>
      </MaxSize>`
      : ""
  }${
    minWidth && minHeight
      ? `<MinSize>
        <Width>${minWidth}</Width>
        <Height>${minHeight}</Height>
      </MinSize>`
      : ""
  }</Geometry>
    <Icons>
      <Icon Type="Normal">${normal}</Icon>
      <Icon Type="DarkNormal">${darkNormal}</Icon>
      <Icon Type="RollOver">${normalRollOver}</Icon>
      <Icon Type="DarkRollOver">${darkNormalRollOver}</Icon>
    </Icons>
  </UI>
</DispatchInfo>
</Extension>
`;
};
