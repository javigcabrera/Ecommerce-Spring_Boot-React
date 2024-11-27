package com.bazarPepe.eccomerce.service.interfaces;

import com.bazarPepe.eccomerce.dto.AddressDto;
import com.bazarPepe.eccomerce.dto.Response;

public interface AddressService {

    Response saveAndUpdateAddress(AddressDto addressDto);
}
