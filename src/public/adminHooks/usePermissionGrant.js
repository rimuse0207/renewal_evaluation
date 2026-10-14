import { useState, useEffect } from "react";
import { MOCK_ORG_BY_YEAR } from "../global/variable";
import { Request_Get_Axios, Request_Post_Axios } from "../../API";

export const usePermissionGrant = () => {
  const [selectedYear, setSelectedYear] = useState("2026");
  const currentOrg = MOCK_ORG_BY_YEAR[selectedYear] || MOCK_ORG_BY_YEAR["2026"];

  const [expandedDepts, setExpandedDepts] = useState(Object.keys(currentOrg));
  const [selectedTeam, setSelectedTeam] = useState(null);

  const [grantee, setGrantee] = useState(null);

  const [teamUsers, setTeamUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  const [selectedTargets, setSelectedTargets] = useState([]);

  const [initialTargets, setInitialTargets] = useState([]);
  const [isLoadingTargets, setIsLoadingTargets] = useState(false);
  const [Grantee_Options, setGrantee_Options] = useState([]);
  const [nowIncludeMenuAccessUser, setNowIncludeMenuAccessUser] = useState([]);

  const [activeMenu, setActiveMenu] = useState("MENU");

  // 연도 변경 시 초기화
  useEffect(() => {
    setExpandedDepts(Object.keys(currentOrg));
    setSelectedTeam(null);
    setTeamUsers([]);
    setGrantee(null);
    setSelectedTargets([]);
    setInitialTargets([]);
  }, [selectedYear, currentOrg]);

  useEffect(() => {
    getGranteeUserList();
  }, [activeMenu, selectedYear]);
  const getGranteeUserList = async () => {
    const req = await Request_Get_Axios("/Admin/getGranteeUserList", {
      activeMenu,
      selectedYear,
    });

    if (req.status) {
      setGrantee_Options(req.data);
    }
  };

  // 권한 수여자 선택 시 기존 권한 불러오기
  useEffect(() => {
    const fetchExistingPermissions = async () => {
      if (!grantee) {
        setSelectedTargets([]);
        setInitialTargets([]); // 초기화
        return;
      }
      AlreadyUserAxios();
      setIsLoadingTargets(true);
    };
    fetchExistingPermissions();
  }, [grantee, selectedYear]);

  const AlreadyUserAxios = async () => {
    try {
      const req = await Request_Get_Axios("/Admin/AlreadyUserList", {
        grantee,
        selectedYear,
      });

      if (req.status) {
        setSelectedTargets(req.data.map((u) => ({ ...u, isExisting: true })));

        setInitialTargets(req.data.map((u) => u.user_id));
      }
    } catch (error) {
      console.error("기존 권한 로드 실패", error);
    } finally {
      setIsLoadingTargets(false);
    }
  };

  useEffect(() => {
    const fetchTeamUsers = async () => {
      if (!selectedTeam) {
        setTeamUsers([]);
        return;
      }
      setIsLoadingUsers(true);
      try {
        const getUserList = await Request_Get_Axios("/Admin/getUserList", {
          selectedYear,
          selectedTeam,
        });
        if (getUserList.status) setTeamUsers(getUserList.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingUsers(false);
      }
    };
    fetchTeamUsers();
  }, [selectedTeam, selectedYear]);

  const handleChangeMenuUserList = async (role_code) => {
    setNowIncludeMenuAccessUser([]);
    const req = await Request_Get_Axios("/Admin/getMenuAccessList", {
      role_code,
    });

    if (req.status) {
      setNowIncludeMenuAccessUser(req.data);
    }
  };

  const handleAddAccessMenuUserList = async (role_code, selectUser) => {
    const req = await Request_Post_Axios("/Admin/saveMenuAccessList", {
      role_code,
      selectUser: selectUser.value,
    });

    if (req.status) {
      setNowIncludeMenuAccessUser(
        nowIncludeMenuAccessUser.concat({
          user_id: selectUser.value,
          fullName: selectUser.fullName,
          titleName: selectUser.titleName,
          departmentName: selectUser.departmentName,
          role_code: role_code,
        }),
      );
    }
  };

  const handleDeleteAccessMenuUserList = async (role_code, selectUser) => {
    const req = await Request_Post_Axios("/Admin/deleteMenuAccessList", {
      role_code,
      selectUser: selectUser,
    });
    if (req.status) {
      setNowIncludeMenuAccessUser(
        nowIncludeMenuAccessUser.filter((item) => item.user_id !== selectUser),
      );
    }
  };

  // 액션 핸들러
  const toggleDept = (deptName) => {
    if (!grantee) return;
    setExpandedDepts((prev) =>
      prev.includes(deptName)
        ? prev.filter((d) => d !== deptName)
        : [...prev, deptName],
    );
  };

  const handleTeamClick = (teamName) => {
    if (!grantee) return;
    setSelectedTeam(teamName);
  };

  const handleToggleTarget = (user) => {
    setSelectedTargets((prev) => {
      const isExist = prev.some((t) => t.user_id === user.user_id);
      if (isExist) return prev.filter((t) => t.user_id !== user.user_id);

      const isOriginallyExisting = initialTargets.includes(user.user_id);
      return [...prev, { ...user, isExisting: isOriginallyExisting }];
    });
  };

  const handleToggleAll = () => {
    const isAllCurrentTeamSelected = teamUsers.every((u) =>
      selectedTargets.some((t) => t.user_id === u.user_id),
    );
    if (isAllCurrentTeamSelected) {
      const currentTeamIds = teamUsers.map((u) => u.user_id);
      setSelectedTargets((prev) =>
        prev.filter((t) => !currentTeamIds.includes(t.user_id)),
      );
    } else {
      setSelectedTargets((prev) => {
        const newTargets = [...prev];
        teamUsers.forEach((u) => {
          if (!newTargets.some((t) => t.user_id === u.user_id)) {
            const isOriginallyExisting = initialTargets.includes(u.user_id);
            newTargets.push({ ...u, isExisting: isOriginallyExisting });
          }
        });
        return newTargets;
      });
    }
  };

  const handleGrantSubmit = async () => {
    const req = await Request_Post_Axios("/Admin/saveAccessUserList", {
      selectedTargets,
      selectedYear,
      granteeId: grantee.value,
    });
    if (req.status) {
      alert("저장되었습니다.");
      await AlreadyUserAxios();
    }
  };
  const isAllChecked =
    teamUsers.length > 0 &&
    teamUsers.every((u) =>
      selectedTargets.some((t) => t.user_id === u.user_id),
    );

  return {
    state: {
      selectedYear,
      currentOrg,
      expandedDepts,
      selectedTeam,
      grantee,
      teamUsers,
      isLoadingUsers,
      selectedTargets,
      isLoadingTargets,
      isAllChecked,
      Grantee_Options,
      nowIncludeMenuAccessUser,
      activeMenu,
    },
    actions: {
      setSelectedYear,
      setGrantee,
      toggleDept,
      handleTeamClick,
      handleToggleTarget,
      handleToggleAll,
      handleGrantSubmit,
      handleChangeMenuUserList,
      handleAddAccessMenuUserList,
      handleDeleteAccessMenuUserList,
      setActiveMenu,
    },
  };
};
