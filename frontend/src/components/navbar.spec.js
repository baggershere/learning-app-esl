import Navbar from "./Navbar";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { findByTestAtrr, testStore } from "./utils/createStore";
import checkPropTypes from "check-prop-types";
import { checkProps } from "./utils/createStore";
configure({ adapter: new Adapter() });

const setUp = (initialState = {}, props = {}) => {
  const store = testStore(initialState);
  const wrapper = shallow(<Navbar store={store} {...props} />)
    .childAt(0)
    .dive();
  return wrapper;
};

describe("navbar components should render without errors on page", () => {
  let wrapper;
  beforeEach(() => {
    const initialState = {
      user: {
        loadingLogin: false,
        name: "d",
        email: "d@gmail.com",
        error: "",
        loading: false,
        isAuth: true,
        selectedChild: [],
      },
      signup: {
        loading: false,
        success: false,
        error: "",
      },
      profile: {
        loading: false,
        children: [],
        averageScoresByGame: [],
        recentScores: [],
        averageOverallScores: [],
        error: "",
        addChildLoading: false,
      },
    };
    wrapper = setUp(initialState);
  });

  it("Should render the navbar without errors", () => {
    const navbar = findByTestAtrr(wrapper, "appbarComponent");
    expect(navbar.length).toBe(1);
  });

  it("Should render the title on the navbar without errors", () => {
    const navbarTitle = findByTestAtrr(wrapper, "navbarTitle");
    expect(navbarTitle.length).toBe(1);
  });

  // Drawer
  it("Drawer should render without errors", () => {
    const drawer = findByTestAtrr(wrapper, "drawer");
    expect(drawer.length).toBe(1);
  });

  it("Drawer should have four items in it", () => {
    const drawerItems = findByTestAtrr(wrapper, "drawerItems");
    expect(drawerItems.props().children.length).toBe(5);
  });
});


