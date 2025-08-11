// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

library AdminLib {
    enum AdminRole { BASIC, MODERATOR, SUPER_ADMIN }

    struct AdminRecord {
        bool isActive;
        AdminRole role;
        uint256 permissions;
        uint256 since;
    }

    struct AdminState {
        mapping(address => AdminRecord) records;
        uint256 total;
    }

    function addAdmin(
        AdminState storage state,
        address admin,
        AdminRole role,
        uint256 permissions
    ) internal {
        require(admin != address(0), "invalid admin");
        require(!state.records[admin].isActive, "already admin");
        state.records[admin] = AdminRecord({
            isActive: true,
            role: role,
            permissions: permissions,
            since: block.timestamp
        });
        state.total += 1;
    }

    function deactivate(AdminState storage state, address admin) internal {
        require(state.records[admin].isActive, "not active");
        state.records[admin].isActive = false;
        if (state.total > 0) state.total -= 1;
    }

    function isAdmin(AdminState storage state, address admin) internal view returns (bool) {
        return state.records[admin].isActive;
    }
}

