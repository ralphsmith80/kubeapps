import * as React from "react";
import { IRelease } from "shared/types";
import "./ChartInfo.v2.css";
import ChartUpdateInfo from "./ChartUpdateInfo";

interface IChartInfoProps {
  app: IRelease;
}

function ChartInfo({ app }: IChartInfoProps) {
  const metadata = app.chart && app.chart.metadata;
  let notes = <div />;
  if (metadata) {
    notes = (
      <section className="chartinfo-subsection" aria-labelledby="chartinfo-versions">
        <h5 className="chartinfo-subsection-title" id="chartinfo-versions">
          Versions
        </h5>
        <div>
          {metadata.appVersion && <div>App Version: {metadata.appVersion}</div>}
          <span>Chart Version: {metadata.version}</span>
        </div>
      </section>
    );
  }
  return (
    <>
      <section className="chartinfo-subsection" aria-labelledby="chartinfo-description">
        <h5 className="chartinfo-subsection-title" id="chartinfo-description">
          Description
        </h5>
        <span>{metadata?.description}</span>
      </section>
      {notes}
      <ChartUpdateInfo app={app} />
    </>
  );
}

export default ChartInfo;
