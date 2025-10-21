import { Controller, Get, Query } from '@nestjs/common';
import { AdminService } from './admin.service';


@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Get('get_users')
    async GetUsers(@Query('limit') limit = 10, @Query('offset') offset = 0): Promise<{ data: any[]; total: number }> {

        let { data, total } = await this.adminService.GetUsers("user", limit, offset);
        try {
            return { data: data, total: total };
        } catch (error) {
            return { data: data, total: 0 };
        }

    }
    @Get("get_team_members")
    async GetTeamMembers() {

        let { data, total } = await this.adminService.GetOtherMembers();
        try {
            return { data: data, total: total };
        } catch (error) {
            return { data: data, total: 0 };
        }

    }
    @Get('getUserByID')
    async GetUserByID(@Query('user_id')  user_id:string) {

        let data = await this.adminService.GetUserByID(user_id);
        try {
            return { data: data };
        } catch (error) {
            return { data: data };
        }

    }
    @Get('changeActive')
    async changeActive(@Query('user_id')  user_id:string, @Query("is_active")is_active : boolean) {

        let data = await this.adminService.changeActivation(user_id,is_active);
        try {
            return { data: data };
        } catch (error) {
            return { data: data };
        }

    }
}

