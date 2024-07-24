import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import axios from "axios";
import "./Friends.css";
import { CopyToClipboard } from "react-copy-to-clipboard";

const Friends = () => {
  const token = Cookies.get("token");
  const decoded = jwtDecode(token);
  const LogedinUser = decoded._doc;
  const logedInUserEmail = LogedinUser.email;
  const logedInUserName = LogedinUser.name;

  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/getFriends`, {
          params: { email: logedInUserEmail },
        });
        setFriends(response.data);
      } catch (error) {
        console.error("Error fetching friends:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFriends();
  }, [logedInUserEmail]);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(logedInUserName)
      .then(() => {
        console.log(`Copied ${logedInUserName} to clipboard successfully`);
      })
      .catch((error) => {
        console.error("Unable to copy:", error);
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <div className="innerContainer">
        <CopyToClipboard text={logedInUserName} onCopy={handleCopy}>
          <button className="copyBtn">Copy Your Referal Code</button>
        </CopyToClipboard>
      </div>
      {friends.length > 0 ? (
        <ul className="frndUl">
          {friends.map((friend, index) => (
            <li className="frndLi" key={index}>
              {friend}
            </li>
          ))}
        </ul>
      ) : (
        <p>No refer friends</p>
      )}
    </div>
  );
};

export default Friends;