import { DatabaseOutlined, HomeOutlined, ShopOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import { useHistory } from "react-router-dom";

const { Text } = Typography;

const BottomBar = () => {
  const history = useHistory();

  const changeNavigation = (path) => history.push(path);

  return (
    <div className="bottom-bar">
      <div className="text-align-center flex flex-col" onClick={() => changeNavigation('/')}>
        <HomeOutlined className="font-size-22" />
        <Text className="font-size-13">Home</Text>
      </div>
      <div className="text-align-center flex flex-col" onClick={() => changeNavigation('/food-categories')}>
        <ShopOutlined className="font-size-22" />
        <Text className="font-size-13">Food Categories</Text>
      </div>
      <div className="text-align-center flex flex-col" onClick={() => changeNavigation('/metadata')}>
        <DatabaseOutlined className="font-size-22" />
        <Text className="font-size-13">Metadata</Text>
      </div>
    </div>
  );
}

export default BottomBar;