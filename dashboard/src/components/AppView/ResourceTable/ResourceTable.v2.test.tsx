import Table from "components/js/Table";
import LoadingWrapper from "components/LoadingWrapper/LoadingWrapper.v2";
import { mount } from "enzyme";
import * as React from "react";
import ResourceRef from "shared/ResourceRef";
import { IResource } from "shared/types";
import ResourceTable from "./ResourceTable.v2";

const defaultProps = {
  id: "test",
  resourceRefs: [],
  resources: {},
  watchResource: jest.fn(),
  closeWatch: jest.fn(),
};

const sampleResourceRef = {
  apiVersion: "v1",
  kind: "Deployment",
  name: "foo",
  namespace: "default",
  filter: "",
  getResourceURL: jest.fn(() => "deployment-foo"),
  watchResourceURL: jest.fn(),
  getResource: jest.fn(),
  watchResource: jest.fn(),
} as ResourceRef;

const deployment = {
  metadata: {
    name: "foo",
  },
  status: {
    replicas: 1,
    updatedReplicas: 0,
    availableReplicas: 0,
  },
};

it("watches the given resources and close watchers", () => {
  const watchResource = jest.fn();
  const closeWatch = jest.fn();
  const wrapper = mount(
    <ResourceTable
      {...defaultProps}
      watchResource={watchResource}
      closeWatch={closeWatch}
      resourceRefs={[sampleResourceRef]}
    />,
  );
  expect(watchResource).toHaveBeenCalledWith(sampleResourceRef);
  wrapper.unmount();
  expect(closeWatch).toHaveBeenCalledWith(sampleResourceRef);
});

it("renders a table with a resource", () => {
  const wrapper = mount(
    <ResourceTable
      {...defaultProps}
      resourceRefs={[sampleResourceRef]}
      resources={{
        "deployment-foo": {
          isFetching: false,
          item: deployment as IResource,
        },
      }}
    />,
  );
  expect(wrapper.find(Table).prop("data")).toEqual([
    { name: "foo", desired: 1, upToDate: 0, available: 0 },
  ]);
});

it("renders a table with a loading resource", () => {
  const wrapper = mount(
    <ResourceTable
      {...defaultProps}
      resourceRefs={[sampleResourceRef]}
      resources={{
        "deployment-foo": {
          isFetching: true,
        },
      }}
    />,
  );
  const data = wrapper.find(Table).prop("data");
  const row = data[0];
  expect(row.name).toEqual("foo");
  expect(wrapper.find(LoadingWrapper)).toExist();
});

it("renders a table with an error", () => {
  const wrapper = mount(
    <ResourceTable
      {...defaultProps}
      resourceRefs={[sampleResourceRef]}
      resources={{
        "deployment-foo": {
          isFetching: false,
          error: new Error("Boom!"),
        },
      }}
    />,
  );
  const data = wrapper.find(Table).prop("data");
  const row = data[0];
  expect(row.name).toEqual("foo");
  expect(wrapper.text()).toContain("Error: Boom!");
});
